import { notFound } from "next/navigation";
import { ExceptionResolveButton } from "@/components/platform/exception-resolve-button";
import { OrderExportButton } from "@/components/platform/order-export-button";
import { OrderNoteComposer } from "@/components/platform/order-note-composer";
import { OrderReviewControls } from "@/components/platform/order-review-controls";
import { OrderUndoButton } from "@/components/platform/order-undo-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { flags } from "@/lib/env";
import { getWorkspaceOrderByExternalRef } from "@/lib/orders";
import { getPlatformAccessState } from "@/lib/platform-shell-core";
import { getReasonCodesForAction, getWorkspaceWorkflowSettings } from "@/lib/workflow";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const viewer = await getViewer();
  const accessState = getPlatformAccessState(viewer);

  if (accessState !== "READY" || !viewer.workspace?.id) {
    return null;
  }

  const order = await getWorkspaceOrderByExternalRef(viewer.workspace.id, orderId);
  const workflowSettings = await getWorkspaceWorkflowSettings(viewer.workspace.id);

  if (!order) {
    notFound();
  }

  const openExceptionCount = order.exceptions.filter((item) => item.state !== "RESOLVED").length;
  const canEdit = Boolean(flags.hasDatabase && viewer.workspace?.id);
  const canExport = canEdit && (order.statusKey === "APPROVED" || order.statusKey === "EXPORTED");
  const hasUndoableAction = order.activity.some((item) => item.undoable && !item.isUndone);
  const workflowReasonCodes = [
    ...getReasonCodesForAction(workflowSettings.reasonCodes, "APPROVAL"),
    ...getReasonCodesForAction(workflowSettings.reasonCodes, "RETURN_TO_REVIEW"),
    ...getReasonCodesForAction(workflowSettings.reasonCodes, "EXPORT"),
  ];

  return (
    <div className="min-w-0 space-y-6">
      <section className="panel rounded-[28px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Badge>{order.status}</Badge>
            <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-white lg:text-4xl">{order.id} · {order.customer}</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">{order.summary}</p>
            <div className="mt-5">
              <OrderReviewControls
                orderId={order.id}
                status={order.statusKey}
                openExceptionCount={openExceptionCount}
                isReady={canEdit}
                reasonCodes={workflowReasonCodes}
                nextApprovalRole={order.nextApprovalRole}
              />
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-end">
            <OrderUndoButton orderId={order.id} disabled={!hasUndoableAction || !canEdit} />
            <OrderExportButton orderId={order.id} disabled={!canExport} />
            <Badge variant="violet">{order.value}</Badge>
            <Badge variant="success">{order.confidence}% confidence</Badge>
            <Badge variant="muted">{order.lines} active lines</Badge>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Line-item mapping</CardTitle>
            <CardDescription>Each line keeps its confidence and mapping state before export.</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0 space-y-3">
            {order.lineItems.map((line, index) => (
              <div key={`${order.id}-${line.sku}-${index}`} className="overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-medium text-white">{line.description}</p>
                    <p className="mt-1 text-sm text-white/56">
                      Requested SKU <span className="break-all text-white/72">{line.sku}</span> · Qty {line.qty}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Badge>{line.match}% match</Badge>
                    <Badge variant={line.state === "Matched" ? "success" : "violet"}>{line.state}</Badge>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-sm text-white/70">
                  ERP mapping target: <span className="break-all font-medium text-white">{line.mappedTo}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-4">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Approval chain</CardTitle>
              <CardDescription>Role-based approval steps for this order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.approvals.length ? (
                order.approvals.map((approval) => (
                  <div key={approval.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-sm font-medium text-white/84">Step {approval.sequence} · {approval.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{approval.requiredRole} · {approval.status}</p>
                    <p className="mt-2 text-sm text-white/60">
                      {approval.reasonCode ? `Reason ${approval.reasonCode}` : "No reason code recorded yet"}
                      {approval.approvedByName ? ` · ${approval.approvedByName}` : ""}
                      {approval.approvedAt ? ` · ${approval.approvedAt}` : ""}
                    </p>
                    {approval.comment ? <p className="mt-2 text-sm text-white/60">{approval.comment}</p> : null}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
                  No extra approval steps are required for this order right now.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exceptions and notes</CardTitle>
              <CardDescription>Context captured during review and handoff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.exceptions.length ? (
                order.exceptions.map((exception) => (
                  <div key={exception.id} className="rounded-2xl border border-violet-400/20 bg-violet-400/8 px-4 py-3 text-sm text-violet-50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p>{exception.message}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-violet-100/70">{exception.state}</p>
                      </div>
                      <ExceptionResolveButton
                        orderId={order.id}
                        exceptionId={exception.id}
                        disabled={!canEdit || exception.state === "RESOLVED"}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
                  No active exceptions are blocking this order right now.
                </div>
              )}
              <OrderNoteComposer orderId={order.id} disabled={!canEdit} />
              {order.notes.length ? (
                order.notes.map((note) => {
                  const isMailboxBodyNote = note.body.startsWith("Mailbox body:");
                  const mailboxBody = isMailboxBodyNote ? note.body.slice("Mailbox body:".length).trim() : "";

                  return (
                    <div key={note.id} className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                      {isMailboxBodyNote ? (
                        <div className="space-y-3">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Mailbox body</p>
                          <div className="max-h-56 overflow-y-auto rounded-2xl border border-white/8 bg-slate-950/60 px-3 py-2 text-xs leading-6 text-white/68 whitespace-pre-wrap [overflow-wrap:anywhere]">
                            {mailboxBody || "No mailbox content captured."}
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{note.body}</p>
                      )}
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/38">{note.authorName ?? "System"} · {note.createdAt}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
                  No reviewer notes have been added yet.
                </div>
              )}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/58">Ship-to: <span className="break-words text-white/72">{order.shippingAddress}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity history</CardTitle>
              <CardDescription>Timeline of intake, review, and handoff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.activity.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-medium text-white/84">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{item.time} · {item.actorName ?? "System"}{item.isUndone ? " · Undone" : ""}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export history</CardTitle>
              <CardDescription>Downstream ERP push attempts and results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.exportRuns.length ? (
                order.exportRuns.map((run) => (
                  <div key={run.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <p className="text-sm font-medium text-white/84">{run.connectionName ?? "ERP"} · {run.status}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{run.createdAt}</p>
                    <p className="mt-2 text-sm text-white/60">{run.message ?? "No export message recorded."}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
                  No ERP handoff has been attempted for this order yet. Approve the order to enable export.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

