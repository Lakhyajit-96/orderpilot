import { BillingReplayButton } from "@/components/platform/billing-replay-button";
import { CustomerPortalButton } from "@/components/platform/customer-portal-button";
import { ErpConnectionForm } from "@/components/platform/erp-connection-form";
import { ExportRetryButton } from "@/components/platform/export-retry-button";
import { MailboxBootstrapButton } from "@/components/platform/mailbox-bootstrap-button";
import { MailboxConnectionForm } from "@/components/platform/mailbox-connection-form";
import { MailboxSyncButton } from "@/components/platform/mailbox-sync-button";
import { MailboxTokenRefreshButton } from "@/components/platform/mailbox-token-refresh-button";
import { NotificationReadButton } from "@/components/platform/notification-read-button";
import { SubscriptionButton } from "@/components/platform/subscription-button";
import { WorkflowPolicyForm } from "@/components/platform/workflow-policy-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { getBillingDiagnosticsSnapshot } from "@/lib/billing-diagnostics";
import { getWorkspaceErpConnections, getWorkspaceExportRuns } from "@/lib/erp";
import { env, flags } from "@/lib/env";
import { getWorkspaceInboxConnections } from "@/lib/inbox";
import { plans } from "@/lib/plans";
import { getWorkspaceNotifications, getWorkspaceWorkflowSettings } from "@/lib/workflow";

const settingsCards = [
  {
    title: "Inbox connections",
    description: "Connect shared mailboxes, parsing pipelines, and file ingress.",
    items: ["Microsoft 365 shared inbox", "Gmail routing alias", "Manual upload dropzone"],
  },
  {
    title: "Billing + plans",
    description: "Seat pricing, processed order volume, and premium support controls.",
    items: ["Starter · 2 operators", "Growth · ERP export enabled", "Enterprise SSO placeholder"],
  },
  {
    title: "Automation rules",
    description: "Set confidence thresholds, route exceptions, and control who approves exports.",
    items: ["Auto-approve above 98%", "Route unmapped SKUs to catalog", "Require finance review for >$25k"],
  },
];

function formatStatusLabel(value: string | null | undefined) {
  if (!value) {
    return "Not connected";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatEventTimestamp(value: Date) {
  return value.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEventBadgeVariant(status: string) {
  if (status === "PROCESSED") {
    return "success" as const;
  }

  if (status === "RECEIVED") {
    return "default" as const;
  }

  return "muted" as const;
}

export default async function SettingsPage() {
  const viewer = await getViewer();
  const [inboxConnections, erpConnections, exportRuns, workflowSettings, notifications] = await Promise.all([
    getWorkspaceInboxConnections(viewer.workspace?.id),
    getWorkspaceErpConnections(viewer.workspace?.id),
    getWorkspaceExportRuns(viewer.workspace?.id),
    getWorkspaceWorkflowSettings(viewer.workspace?.id),
    getWorkspaceNotifications({
      organizationId: viewer.workspace?.id,
      clerkUserId: viewer.clerkUserId,
    }),
  ]);
  const billingDiagnostics = await getBillingDiagnosticsSnapshot(viewer.workspace?.id);
  const recentBillingEvents = billingDiagnostics.recentEvents;
  const failedBillingEvents = billingDiagnostics.failedEvents;
  const activePlan = viewer.workspace?.subscription?.planKey ?? null;
  const hasManagedSubscription = Boolean(
    viewer.workspace?.subscription?.stripeCustomerId ||
      viewer.workspace?.subscription?.stripeSubscriptionId,
  );
  const hasPortalAccess = Boolean(
    flags.hasStripe && hasManagedSubscription,
  );
  const workflowReasonCodesText = workflowSettings.reasonCodes
    .map((code) => `${code.actionType} | ${code.code} | ${code.label}`)
    .join("\n");

  const readiness = [
    {
      title: "Authentication",
      status: flags.hasClerk ? "Configured" : "Pending setup",
      description: flags.hasClerk
        ? viewer.isAuthenticated
          ? `Signed in as ${viewer.displayName}. Clerk session is active.`
          : "Clerk keys detected. Sign in to activate workspace-aware access control."
        : "Add Clerk keys to enable secure sign-in and self-serve onboarding.",
    },
    {
      title: "Billing",
      status: flags.hasStripe ? "Configured" : "Pending setup",
      description: flags.hasStripe
        ? viewer.workspace?.subscription
          ? `Subscription status: ${formatStatusLabel(viewer.workspace.subscription.status)}.`
          : "Stripe keys detected. Checkout sessions can now be created from the pricing controls below."
        : "Add Stripe keys and price IDs to enable subscriptions.",
    },
    {
      title: "Database",
      status: flags.hasDatabase ? "Configured" : "Pending setup",
      description: flags.hasDatabase
        ? viewer.workspace
          ? `Workspace ${viewer.workspace.name} is connected to Prisma persistence.`
          : "DATABASE_URL is available. Prisma will create a workspace on the first authenticated request."
        : "Add a PostgreSQL connection string to enable persistence.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="violet">System settings</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Control the operating model behind the automation</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">
          This is where production concerns plug in next: auth, billing, mailbox sync, approvals, and team-based routing.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {settingsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {card.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">{item}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {readiness.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant={item.status === "Configured" ? "success" : "muted"}>{item.status}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mailbox provider integration</CardTitle>
          <CardDescription>
            Connect Gmail or Microsoft 365 with polling today, or use the webhook-ready endpoint for normalized push ingestion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MailboxConnectionForm />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Connections: {inboxConnections.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Polling ready: {inboxConnections.filter((item) => item.syncMode === "POLLING").length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Webhook-ready: {inboxConnections.filter((item) => item.syncMode === "WEBHOOK").length}
            </div>
          </div>
          {inboxConnections.length ? (
            inboxConnections.map((connection) => (
              <div key={connection.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{connection.provider} · {connection.address}</p>
                    <p className="text-xs text-white/45">
                      {connection.syncMode} · Last sync {connection.lastSyncedAt ? formatEventTimestamp(connection.lastSyncedAt) : "never"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <MailboxSyncButton connectionId={connection.id} />
                    <MailboxTokenRefreshButton connectionId={connection.id} />
                    <MailboxBootstrapButton connectionId={connection.id} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  OAuth: {connection.oauthConnected ? "Connected" : "Manual / not connected"} · Access token: {connection.accessToken ?? "not stored"} · Webhook secret: {connection.webhookSecret ?? "not stored"}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  Subscription: {formatStatusLabel(connection.providerSubscriptionStatus)} · Expires {connection.providerSubscriptionExpiresAt ? formatEventTimestamp(connection.providerSubscriptionExpiresAt) : "not bootstrapped"}
                </p>
                {connection.lastError ? <p className="mt-2 text-sm text-amber-200/80">{connection.lastError}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No Gmail or Microsoft 365 mailbox connections are configured yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ERP/export integration</CardTitle>
          <CardDescription>
            Push approved orders into a real downstream endpoint and retry failed runs safely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ErpConnectionForm />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              ERP connections: {erpConnections.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Failed exports: {exportRuns.filter((run) => run.status === "FAILED").length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Successful exports: {exportRuns.filter((run) => run.status === "SUCCESS").length}
            </div>
          </div>
          {erpConnections.length ? (
            erpConnections.map((connection) => (
              <div key={connection.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <p className="text-sm font-medium text-white">{connection.name}</p>
                <p className="mt-1 text-xs text-white/45">{connection.provider} · {connection.endpointUrl}</p>
                <p className="mt-2 text-sm text-white/55">Auth header: {connection.authHeader ?? "not stored"}</p>
                <p className="mt-1 text-sm text-white/55">
                  Field mappings: {connection.fieldMappings ? "Configured" : "Default"} · Adapter settings: {connection.adapterSettings ? "Configured" : "Default"}
                </p>
                {connection.lastError ? <p className="mt-2 text-sm text-amber-200/80">{connection.lastError}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No ERP/export connection is configured yet.
            </div>
          )}
          {exportRuns.length ? (
            exportRuns.map((run) => (
              <div key={run.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{run.order.externalRef} · {run.erpConnection?.name ?? "ERP"}</p>
                    <p className="text-xs text-white/45">{formatEventTimestamp(run.createdAt)} · {formatStatusLabel(run.status)}</p>
                  </div>
                  {run.status === "FAILED" ? <ExportRetryButton exportRunId={run.id} /> : null}
                </div>
                <p className="mt-2 text-sm text-white/55">{run.message ?? "No export message recorded."}</p>
              </div>
            ))
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review workflow policy</CardTitle>
          <CardDescription>Control multi-step approval roles, thresholds, and reason codes per tenant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Reason codes: {workflowSettings.reasonCodes.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Approval stages: {workflowSettings.stages.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Finance threshold: {workflowSettings.policy.financeThresholdCents ?? 0} cents
            </div>
          </div>
          <WorkflowPolicyForm
            initialRequireReasonCodes={workflowSettings.policy.requireReasonCodes}
            initialAutoApproveConfidence={workflowSettings.policy.autoApproveConfidence}
            initialFinanceThresholdCents={workflowSettings.policy.financeThresholdCents}
            initialStages={workflowSettings.stages.map((stage) => ({
              ...stage,
              minOrderValueCents: stage.minOrderValueCents ?? null,
            }))}
            initialReasonCodesText={workflowReasonCodesText}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow notifications</CardTitle>
          <CardDescription>Unread approval and export notifications routed to your current workspace role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.length ? (
            notifications.map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{notification.title}</p>
                    <p className="text-xs text-white/45">{formatEventTimestamp(notification.createdAt)} · {formatStatusLabel(notification.type)}</p>
                  </div>
                  <NotificationReadButton notificationId={notification.id} disabled={notification.isRead} />
                </div>
                <p className="mt-2 text-sm text-white/60">{notification.body}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No notifications are waiting for this workspace user.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace billing</CardTitle>
          <CardDescription>Live tenant and subscription state from your configured backend.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Workspace: {viewer.workspace?.name ?? "Not provisioned yet"}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Role: {viewer.workspace?.role ?? "Not assigned"}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Plan: {activePlan ? activePlan.charAt(0).toUpperCase() + activePlan.slice(1) : "No active subscription"}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomerPortalButton isReady={hasPortalAccess} />
            <p className="text-sm text-white/55">
              {hasPortalAccess
                ? "Update payment method, switch plans, or cancel inside Stripe Billing Portal."
                : "The billing portal unlocks automatically after the first completed checkout."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing diagnostics</CardTitle>
          <CardDescription>
            Recent Stripe webhook outcomes linked to this workspace for easier debugging.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Webhook secret: {env.STRIPE_WEBHOOK_SECRET ? "Configured" : "Missing"}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Recent events: {recentBillingEvents.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Failed events: {failedBillingEvents.length}
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            Linked subscription state: {billingDiagnostics.subscription?.status ? formatStatusLabel(billingDiagnostics.subscription.status) : "No persisted subscription yet"}
            {billingDiagnostics.subscription?.planKey ? ` · ${billingDiagnostics.subscription.planKey}` : ""}
          </div>
          {recentBillingEvents.length ? (
            recentBillingEvents.map((event) => (
              <div key={event.externalEventId} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{event.eventType}</p>
                    <p className="text-xs text-white/45">{formatEventTimestamp(event.createdAt)}</p>
                  </div>
                  <Badge variant={getEventBadgeVariant(event.status)}>{formatStatusLabel(event.status)}</Badge>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  Customer: {event.stripeCustomerId ?? "pending"} · Subscription: {event.stripeSubscriptionId ?? "pending"}
                </p>
                {event.message ? <p className="mt-2 text-sm text-amber-200/80">{event.message}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No billing events have been logged for this workspace yet. Complete a checkout or forward Stripe webhooks to populate this feed.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Failed webhook replay queue</CardTitle>
          <CardDescription>Only failed or ignored events can be replayed. Replays pull the canonical event from Stripe before reprocessing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {failedBillingEvents.length ? (
            failedBillingEvents.map((event) => (
              <div key={`${event.externalEventId}-failed`} className="rounded-2xl border border-amber-400/20 bg-amber-400/8 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{event.eventType}</p>
                    <p className="text-xs text-white/55">{formatEventTimestamp(event.createdAt)} · {event.externalEventId}</p>
                  </div>
                  <BillingReplayButton eventId={event.externalEventId} />
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Customer: {event.stripeCustomerId ?? "pending"} · Subscription: {event.stripeSubscriptionId ?? "pending"} · Plan: {event.planKey ?? "pending"}
                </p>
                {event.message ? <p className="mt-2 text-sm text-amber-100/90">{event.message}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No failed or ignored billing events are waiting for replay.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.key} className={plan.key === "growth" ? "border-cyan-400/20" : undefined}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.name}</CardTitle>
                {activePlan === plan.key ? <Badge variant="success">Current</Badge> : null}
                {activePlan !== plan.key && plan.key === "growth" ? <Badge>Recommended</Badge> : null}
              </div>
              <CardDescription>{plan.subtitle}</CardDescription>
              <div className="pt-3 text-3xl font-semibold text-white">
                {plan.price} <span className="text-sm font-normal text-white/45">{plan.cadence}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">{feature}</div>
              ))}
              <div className="pt-2">
                {hasManagedSubscription && plan.key !== "enterprise" ? (
                  activePlan === plan.key ? (
                    <CustomerPortalButton isReady={hasPortalAccess} />
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      Change in billing portal
                    </Button>
                  )
                ) : (
                  <SubscriptionButton planKey={plan.key} isCheckoutReady={flags.hasStripe} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

