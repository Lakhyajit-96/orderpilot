/**
 * AI-powered order extraction from emails and documents.
 * Uses OpenAI GPT-4 for intelligent parsing of unstructured order data.
 * 
 * To enable:
 * 1. Add OPENAI_API_KEY to environment variables
 * 2. Install: pnpm add openai
 */

import { env } from "@/lib/env";

export type ExtractedOrder = {
  customerName: string;
  customerEmail?: string;
  poNumber?: string;
  lineItems: Array<{
    sku: string;
    description: string;
    quantity: number;
    unitPrice?: number;
  }>;
  shippingAddress?: string;
  notes?: string[];
  confidence: number;
  exceptions: string[];
};

/**
 * Extract order data from email body text using AI.
 * Falls back to simple parsing if AI is not configured.
 */
export async function extractOrderFromEmail(input: {
  subject: string;
  body: string;
  fromEmail: string;
  fromName: string;
}): Promise<ExtractedOrder> {
  // TODO: Implement OpenAI GPT-4 extraction when API key is configured
  // For now, use simple fallback parsing
  
  return extractOrderFallback(input);
}

/**
 * Extract order data from PDF or image attachment using AI vision.
 * Falls back to manual review if AI is not configured.
 */
export async function extractOrderFromDocument(input: {
  fileUrl: string;
  fileName: string;
  mimeType: string;
}): Promise<ExtractedOrder> {
  // TODO: Implement OpenAI GPT-4 Vision extraction when API key is configured
  // For now, return placeholder requiring manual review
  
  return {
    customerName: "Unknown Customer",
    customerEmail: undefined,
    poNumber: input.fileName,
    lineItems: [
      {
        sku: "MANUAL-REVIEW",
        description: `Document attachment: ${input.fileName}`,
        quantity: 1,
      },
    ],
    confidence: 0,
    exceptions: [
      "Document requires manual review and data entry",
      "AI extraction not yet configured",
    ],
  };
}

/**
 * Fallback extraction using simple pattern matching.
 * Used when AI is not configured or as a backup.
 */
function extractOrderFallback(input: {
  subject: string;
  body: string;
  fromEmail: string;
  fromName: string;
}): ExtractedOrder {
  const body = input.body.trim();
  const exceptions: string[] = [];
  let confidence = 50;

  // Try to parse structured line items (SKU | Description | Quantity)
  const lineItemPattern = /^(.+?)\s*\|\s*(.+?)\s*\|\s*(\d+)\s*$/gm;
  const matches = [...body.matchAll(lineItemPattern)];

  if (matches.length > 0) {
    const lineItems = matches.map((match) => ({
      sku: match[1].trim(),
      description: match[2].trim(),
      quantity: Number.parseInt(match[3].trim(), 10),
    }));

    confidence = 75;

    return {
      customerName: input.fromName,
      customerEmail: input.fromEmail,
      poNumber: extractPONumber(input.subject, body),
      lineItems,
      shippingAddress: extractShippingAddress(body),
      notes: extractNotes(body),
      confidence,
      exceptions: lineItems.length < 3 ? ["Order has fewer than 3 line items"] : [],
    };
  }

  // No structured data found - needs manual review
  exceptions.push("Email body does not contain structured line items");
  exceptions.push("Use format: SKU | Description | Quantity");
  confidence = 20;

  return {
    customerName: input.fromName,
    customerEmail: input.fromEmail,
    poNumber: extractPONumber(input.subject, body),
    lineItems: [
      {
        sku: "EMAIL-REVIEW",
        description: input.subject || "Inbound order email",
        quantity: 1,
      },
    ],
    shippingAddress: extractShippingAddress(body),
    notes: [body.slice(0, 500)],
    confidence,
    exceptions,
  };
}

function extractPONumber(subject: string, body: string): string | undefined {
  // Look for PO number patterns
  const patterns = [
    /PO[#:\s]*([A-Z0-9-]+)/i,
    /Purchase Order[#:\s]*([A-Z0-9-]+)/i,
    /Order[#:\s]*([A-Z0-9-]+)/i,
  ];

  const text = `${subject} ${body}`;

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractShippingAddress(body: string): string | undefined {
  // Look for address patterns
  const addressPattern = /(?:ship to|shipping address|deliver to)[:\s]*([^\n]+(?:\n[^\n]+){0,3})/i;
  const match = body.match(addressPattern);

  if (match) {
    return match[1].trim().replace(/\s+/g, " ");
  }

  return undefined;
}

function extractNotes(body: string): string[] {
  const notes: string[] = [];

  // Look for notes or special instructions
  const notesPattern = /(?:notes?|instructions?|comments?)[:\s]*([^\n]+)/gi;
  const matches = [...body.matchAll(notesPattern)];

  for (const match of matches) {
    const note = match[1].trim();
    if (note && note.length > 5) {
      notes.push(note);
    }
  }

  return notes;
}

/**
 * Validate and enrich extracted order data.
 * Checks for common issues and adds confidence scoring.
 */
export function validateExtractedOrder(order: ExtractedOrder): ExtractedOrder {
  const exceptions = [...order.exceptions];
  let confidence = order.confidence;

  // Check for missing customer info
  if (!order.customerName || order.customerName === "Unknown Customer") {
    exceptions.push("Customer name needs verification");
    confidence = Math.max(0, confidence - 10);
  }

  // Check for suspicious SKUs
  const suspiciousSKUs = order.lineItems.filter(
    (item) => item.sku.includes("REVIEW") || item.sku.includes("MANUAL") || item.sku.includes("EMAIL"),
  );

  if (suspiciousSKUs.length > 0) {
    exceptions.push("One or more line items need manual SKU mapping");
    confidence = Math.max(0, confidence - 15);
  }

  // Check for missing quantities
  const invalidQuantities = order.lineItems.filter((item) => !item.quantity || item.quantity <= 0);

  if (invalidQuantities.length > 0) {
    exceptions.push("One or more line items have invalid quantities");
    confidence = Math.max(0, confidence - 20);
  }

  // Check for very short descriptions
  const shortDescriptions = order.lineItems.filter((item) => item.description.length < 5);

  if (shortDescriptions.length > 0) {
    exceptions.push("Some line items have incomplete descriptions");
    confidence = Math.max(0, confidence - 5);
  }

  return {
    ...order,
    confidence,
    exceptions,
  };
}
