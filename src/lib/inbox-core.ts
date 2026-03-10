type WritableOrderStatus = "INGESTED" | "REVIEW" | "APPROVED" | "EXPORTED";

function buildMailboxSummary(subject: string, summary: string) {
  const normalizedSummary = summary.trim();

  if (normalizedSummary) {
    return normalizedSummary;
  }

  const normalizedSubject = subject.trim();
  return normalizedSubject ? `Inbound email received: ${normalizedSubject}` : "Inbound email received";
}

function parseMailboxLineItems(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sku, description, quantityText] = line.split("|").map((part) => part.trim());
      const quantity = Number.parseInt(quantityText ?? "", 10);

      if (!sku || !description || !quantityText || Number.isNaN(quantity) || quantity <= 0) {
        throw new Error(
          "Each line item must use the format SKU | Description | Quantity with a positive quantity.",
        );
      }

      return { sku, description, quantity };
    });
}

export type MailboxProviderKey = "GMAIL" | "MICROSOFT365";

export type NormalizedMailboxMessage = {
  provider: MailboxProviderKey;
  externalMessageId: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  bodyText: string;
  receivedAt?: string | null;
};

export type GmailPushNotification = {
  emailAddress: string;
  historyId: string;
};

export function maskSecret(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export function parseSenderHeader(rawValue: string | null | undefined) {
  const value = rawValue?.trim() ?? "";
  const match = value.match(/^(.*)<([^>]+)>$/);

  if (match) {
    return {
      name: match[1].replace(/"/g, "").trim() || match[2].split("@")[0],
      email: match[2].trim().toLowerCase(),
    };
  }

  return {
    name: value.split("@")[0] || "Mailbox sender",
    email: value.toLowerCase(),
  };
}

export function decodeGmailPushNotification(encodedData: string): GmailPushNotification {
  const raw = Buffer.from(encodedData, "base64").toString("utf8");
  const parsed = JSON.parse(raw) as { emailAddress?: string; historyId?: string | number };

  if (!parsed.emailAddress?.trim() || parsed.historyId === undefined || parsed.historyId === null) {
    throw new Error("Gmail push notification payload is missing emailAddress or historyId.");
  }

  return {
    emailAddress: parsed.emailAddress.trim().toLowerCase(),
    historyId: String(parsed.historyId),
  };
}

export function isNewerMailboxCursor(nextCursor: string | null | undefined, currentCursor: string | null | undefined) {
  if (!nextCursor?.trim()) {
    return false;
  }

  if (!currentCursor?.trim()) {
    return true;
  }

  const next = nextCursor.trim();
  const current = currentCursor.trim();

  if (next === current) {
    return false;
  }

  if (/^[0-9]+$/.test(next) && /^[0-9]+$/.test(current)) {
    return BigInt(next) > BigInt(current);
  }

  return true;
}

export function buildOrderInputFromMailboxMessage(message: NormalizedMailboxMessage) {
  const body = message.bodyText.trim();
  let lineItems: Array<{ sku: string; description: string; quantity: number }>;
  let status: WritableOrderStatus = "INGESTED";
  const exceptions: string[] = [];

  if (body.includes("|")) {
    try {
      lineItems = parseMailboxLineItems(body);
    } catch {
      lineItems = [
        {
          sku: `${message.provider}-EMAIL`,
          description: message.subject || "Inbound mailbox request",
          quantity: 1,
        },
      ];
      status = "REVIEW";
      exceptions.push("Mailbox payload needs structured line-item extraction.");
    }
  } else {
    lineItems = [
      {
        sku: `${message.provider}-EMAIL`,
        description: message.subject || "Inbound mailbox request",
        quantity: 1,
      },
    ];
    status = "REVIEW";
    exceptions.push("Mailbox payload needs structured line-item extraction.");
  }

  return {
    externalRef: `${message.provider}-${message.externalMessageId}`,
    customerName: message.fromName || message.fromEmail.split("@")[0],
    customerEmail: message.fromEmail,
    sourceEmail: message.fromEmail,
    summary: buildMailboxSummary(message.subject, body.slice(0, 180)),
    status,
    lineItems,
    exceptions,
    notes: [
      `Mailbox provider: ${message.provider}`,
      `Subject: ${message.subject}`,
      body ? `Mailbox body: ${body}` : null,
    ].filter((value): value is string => Boolean(value)),
    activity: [
      { label: `${message.provider} mailbox message received` },
      { label: `Mailbox sender ${message.fromEmail}` },
    ],
  };
}