import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { parseJsonRecord } from "@/lib/erp-core";
import { getWorkspaceErpConnections, upsertErpConnection } from "@/lib/erp";

const erpConnectionSchema = z.object({
  name: z.string().trim().min(2),
  endpointUrl: z.string().url(),
  authHeader: z.string().trim().min(6).optional(),
  provider: z.enum(["WEBHOOK", "NETSUITE", "SAP", "DYNAMICS"]).optional(),
  fieldMappingsText: z.string().optional(),
  adapterSettingsText: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const connections = await getWorkspaceErpConnections(contextResult.context.workspace.id);
  return NextResponse.json({ connections });
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = erpConnectionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const connection = await upsertErpConnection({
      organizationId: contextResult.context.workspace.id,
      name: parsed.data.name,
      endpointUrl: parsed.data.endpointUrl,
      authHeader: parsed.data.authHeader,
      provider: parsed.data.provider,
      fieldMappings: parseJsonRecord(parsed.data.fieldMappingsText ?? "", {}),
      adapterSettings: parseJsonRecord(parsed.data.adapterSettingsText ?? "", {}),
      isActive: parsed.data.isActive,
    });
    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save ERP connection.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}