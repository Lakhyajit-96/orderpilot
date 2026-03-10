export type ErpProviderKey = "WEBHOOK" | "NETSUITE" | "SAP" | "DYNAMICS";

export type ErpFieldMappings = {
  order?: Record<string, string>;
  customer?: Record<string, string>;
  lineItem?: Record<string, string>;
  custom?: Record<string, string>;
};

export type ErpAdapterSettings = Record<string, string | number | boolean | null>;

type BaseExportInput = {
  workspaceName: string;
  orderId: string;
  status: string;
  customerName: string;
  customerEmail?: string | null;
  sourceEmail?: string | null;
  shippingAddress?: string | null;
  summary?: string | null;
  totalCents?: number | null;
  notes: Array<{ body: string; authorName?: string | null }>;
  lineItems: Array<{
    sku: string;
    description: string;
    quantity: number;
    mappedTo?: string | null;
    confidence?: number | null;
  }>;
};

export function maskAuthHeader(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return `${value.slice(0, 6)}••••${value.slice(-4)}`;
}

function applyFieldMappings(
  source: Record<string, unknown>,
  mappings: Record<string, string> | undefined,
) {
  if (!mappings) {
    return source;
  }

  return Object.entries(source).reduce<Record<string, unknown>>((result, [key, value]) => {
    result[mappings[key] ?? key] = value;
    return result;
  }, {});
}

export function buildErpExportPayload(input: BaseExportInput) {
  return {
    workspace: input.workspaceName,
    order: {
      id: input.orderId,
      status: input.status,
      sourceEmail: input.sourceEmail ?? null,
      summary: input.summary ?? null,
      shippingAddress: input.shippingAddress ?? null,
      totalCents: input.totalCents ?? 0,
    },
    customer: {
      name: input.customerName,
      email: input.customerEmail ?? null,
    },
    lineItems: input.lineItems.map((item) => ({
      requestedSku: item.sku,
      mappedSku: item.mappedTo ?? null,
      description: item.description,
      quantity: item.quantity,
      confidence: item.confidence ?? null,
    })),
    notes: input.notes.map((note) => ({
      body: note.body,
      author: note.authorName ?? null,
    })),
  };
}

export function buildErpAdapterPayload(input: {
  provider: ErpProviderKey;
  fieldMappings?: ErpFieldMappings | null;
  adapterSettings?: ErpAdapterSettings | null;
  payload: ReturnType<typeof buildErpExportPayload>;
}) {
  const mappedOrder = applyFieldMappings(input.payload.order, input.fieldMappings?.order);
  const mappedCustomer = applyFieldMappings(input.payload.customer, input.fieldMappings?.customer);
  const mappedLineItems = input.payload.lineItems.map((item) =>
    applyFieldMappings(item, input.fieldMappings?.lineItem),
  );
  const customFields = input.fieldMappings?.custom ?? {};

  if (input.provider === "NETSUITE") {
    return {
      adapter: "NETSUITE",
      recordType: "salesorder",
      body: {
        tranId: input.payload.order.id,
        status: input.payload.order.status,
        memo: input.payload.order.summary,
        shipAddress: input.payload.order.shippingAddress,
        entity: mappedCustomer,
        itemList: mappedLineItems,
        customFieldList: {
          ...customFields,
          workspace: input.payload.workspace,
          sourceEmail: input.payload.order.sourceEmail,
        },
      },
      settings: input.adapterSettings ?? {},
    };
  }

  if (input.provider === "SAP") {
    return {
      adapter: "SAP",
      SalesOrder: {
        DocumentNumber: input.payload.order.id,
        Header: mappedOrder,
        Customer: mappedCustomer,
        Items: mappedLineItems,
        Notes: input.payload.notes,
        Extensions: {
          ...customFields,
          workspace: input.payload.workspace,
          ...input.adapterSettings,
        },
      },
    };
  }

  if (input.provider === "DYNAMICS") {
    return {
      adapter: "DYNAMICS",
      salesOrderNumber: input.payload.order.id,
      orderHeader: mappedOrder,
      account: mappedCustomer,
      orderLines: mappedLineItems,
      notes: input.payload.notes,
      customFields: {
        ...customFields,
        ...input.adapterSettings,
      },
    };
  }

  return {
    adapter: "WEBHOOK",
    ...input.payload,
    mappedOrder,
    mappedCustomer,
    mappedLineItems,
    adapterSettings: input.adapterSettings ?? {},
  };
}

export function parseJsonRecord<T extends Record<string, unknown>>(
  input: string,
  fallback: T,
) {
  const normalized = input.trim();

  if (!normalized) {
    return fallback;
  }

  const parsed = JSON.parse(normalized) as Record<string, unknown>;
  return parsed as T;
}