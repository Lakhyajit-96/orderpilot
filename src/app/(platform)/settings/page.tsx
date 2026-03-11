import Link from "next/link";
import { ArrowUpRight, CheckCircle2, CircleDashed } from "lucide-react";
import { BillingSyncButton } from "@/components/platform/billing-sync-button";
import { CustomerPortalButton } from "@/components/platform/customer-portal-button";
import { ErpConnectionForm } from "@/components/platform/erp-connection-form";
import { ExportRetryButton } from "@/components/platform/export-retry-button";
import { LaunchChecklistExperience } from "@/components/platform/launch-checklist-experience";
import { MailboxBootstrapButton } from "@/components/platform/mailbox-bootstrap-button";
import { MailboxConnectionForm } from "@/components/platform/mailbox-connection-form";
import { MailboxSyncButton } from "@/components/platform/mailbox-sync-button";
import { MailboxTokenRefreshButton } from "@/components/platform/mailbox-token-refresh-button";
import { NotificationReadButton } from "@/components/platform/notification-read-button";
import { SessionActionButton } from "@/components/platform/session-action-button";
import { SubscriptionButton } from "@/components/platform/subscription-button";
import { WorkflowPolicyForm } from "@/components/platform/workflow-policy-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { getBillingDiagnosticsSnapshot } from "@/lib/billing-diagnostics";
import { getPlatformAccessState } from "@/lib/platform-shell-core";
import {
  buildDashboardLaunchChecklist,
  getDashboardLaunchProgress,
  getNextDashboardLaunchStep,
} from "@/lib/dashboard-checklist-core";
import { getWorkspaceErpConnections, getWorkspaceExportRuns } from "@/lib/erp";
import { flags } from "@/lib/env";
import { getWorkspaceInboxConnections } from "@/lib/inbox";
import { recordLaunchChecklistTelemetry } from "@/lib/launch-telemetry";
import { getWorkspaceOrders } from "@/lib/orders";
import { plans } from "@/lib/plans";
import {
  syncCheckoutSessionSubscription,
  syncWorkspaceSubscriptionFromStripe,
} from "@/lib/stripe-event-processor";
import { getStripeServer } from "@/lib/stripe";
import { getWorkspaceNotifications, getWorkspaceWorkflowSettings } from "@/lib/workflow";
import { cn } from "@/lib/utils";

const settingsCards = [
  {
    title: "Input channels",
    description: "Connect the shared inboxes and upload paths your team uses every day.",
    items: ["Microsoft 365 shared inbox", "Gmail routing alias", "Manual upload entry"],
  },
  {
    title: "Plan and access",
    description: "Keep billing, workspace roles, and rollout readiness aligned.",
    items: ["Starter pilot coverage", "Growth plan with ERP handoff", "Team access and onboarding"],
  },
  {
    title: "Review workflow",
    description: "Set confidence thresholds, approval routing, and escalation rules.",
    items: ["Auto-approve above 98%", "Route unmapped SKUs to catalog review", "Require finance review above $25k"],
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

function formatCurrencyFromCents(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((value ?? 0) / 100);
}

function formatSyncMode(value: string) {
  if (value === "WEBHOOK") {
    return "Instant updates";
  }

  if (value === "POLLING") {
    return "Scheduled sync";
  }

  return formatStatusLabel(value);
}

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

function formatPlanLabel(value: string | null | undefined) {
  if (!value) {
    return "No active subscription";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatAccessStateLabel(value: string) {
  if (value === "READY") {
    return "Ready";
  }

  if (value === "SIGN_IN_REQUIRED") {
    return "Sign in needed";
  }

  return "Needs attention";
}

type SettingsNotice = {
  key: string;
  title: string;
  description: string;
  tone: "success" | "warning" | "muted";
};

function getNoticeClasses(tone: SettingsNotice["tone"]) {
  if (tone === "success") {
    return "border-emerald-400/20 bg-emerald-400/8 text-emerald-50";
  }

  if (tone === "warning") {
    return "border-amber-300/25 bg-amber-300/10 text-amber-50";
  }

  return "border-white/10 bg-white/[0.04] text-white";
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const checkoutState = getSearchParamValue(resolvedSearchParams.checkout);
  const checkoutSessionId = getSearchParamValue(resolvedSearchParams.session_id);
  const portalState = getSearchParamValue(resolvedSearchParams.portal);
  const billingState = getSearchParamValue(resolvedSearchParams.billing);
  const mailboxOAuthState = getSearchParamValue(resolvedSearchParams.mailboxOAuth);
  const mailboxMessage = getSearchParamValue(resolvedSearchParams.mailboxMessage);
  const viewer = await getViewer();
  const accessState = getPlatformAccessState(viewer);
  const stripe = flags.hasStripe ? getStripeServer() : null;
  let checkoutSyncError: string | null = null;
  let portalSyncError: string | null = null;

  if (stripe && viewer.workspace?.id && checkoutState === "success" && checkoutSessionId) {
    try {
      await syncCheckoutSessionSubscription({
        stripe,
        sessionId: checkoutSessionId,
        expectedOrganizationId: viewer.workspace.id,
      });
    } catch (error) {
      checkoutSyncError = error instanceof Error ? error.message : "Your purchase was confirmed, but the plan status has not refreshed yet.";
    }
  }

  if (stripe && viewer.workspace?.id && portalState === "return") {
    try {
      await syncWorkspaceSubscriptionFromStripe({
        stripe,
        organizationId: viewer.workspace.id,
      });
    } catch (error) {
      portalSyncError = error instanceof Error ? error.message : "We could not refresh the billing management changes yet.";
    }
  }

  const [inboxConnections, erpConnections, exportRuns, workflowSettings, notifications, workspaceOrders, billingDiagnostics] = await Promise.all([
    getWorkspaceInboxConnections(viewer.workspace?.id),
    getWorkspaceErpConnections(viewer.workspace?.id),
    getWorkspaceExportRuns(viewer.workspace?.id),
    getWorkspaceWorkflowSettings(viewer.workspace?.id),
    getWorkspaceNotifications({
      organizationId: viewer.workspace?.id,
      clerkUserId: viewer.clerkUserId,
    }),
    getWorkspaceOrders(viewer.workspace?.id),
    getBillingDiagnosticsSnapshot(viewer.workspace?.id),
  ]);
  const currentSubscription = billingDiagnostics.subscription ?? viewer.workspace?.subscription ?? null;
  const activePlan = currentSubscription?.planKey ?? null;
  const hasManagedSubscription = Boolean(
    currentSubscription?.stripeCustomerId ||
      currentSubscription?.stripeSubscriptionId,
  );
  const hasPortalAccess = Boolean(
    flags.hasStripe && hasManagedSubscription,
  );
  const accessSummary = accessState === "READY"
    ? "Workspace access is live and ready for your team."
    : accessState === "SIGN_IN_REQUIRED"
      ? "Sign in to open the workspace for your team."
      : accessState === "SIGN_IN_SETUP_REQUIRED"
        ? "Secure workspace access still needs attention before this workspace can open."
        : "Saved orders and workspace settings need attention before your team can continue.";
  const workflowReasonCodesText = workflowSettings.reasonCodes
    .map((code) => `${code.actionType} | ${code.code} | ${code.label}`)
    .join("\n");
  const checklist = buildDashboardLaunchChecklist({
    viewerName: viewer.displayName,
    isAuthenticated: viewer.isAuthenticated,
    workspaceName: viewer.workspace?.name ?? null,
    workspaceRole: viewer.workspace?.role ?? null,
    inboxConnectionCount: inboxConnections.length,
    orderCount: workspaceOrders.length,
    orderStatuses: workspaceOrders.map((order) => order.status),
    erpConnectionCount: erpConnections.length,
    subscriptionPlanKey: currentSubscription?.planKey ?? null,
    subscriptionStatus: currentSubscription?.status ?? null,
  });
  const checklistProgress = getDashboardLaunchProgress(checklist);
  const nextLaunchStep = getNextDashboardLaunchStep(checklist);
  const settingsChecklistLinks = checklist.filter((item) => item.href.startsWith("/settings#"));
  const notices: SettingsNotice[] = [];

  if (mailboxOAuthState === "connected") {
    notices.push({
      key: "mailbox-oauth-connected",
      title: "Mailbox connection is active",
      description: mailboxMessage ?? "The mailbox provider finished secure sign-in and the workspace connection is ready.",
      tone: "success",
    });
  }

  if (mailboxOAuthState === "error") {
    notices.push({
      key: "mailbox-oauth-error",
      title: "Mailbox connection needs attention",
      description: mailboxMessage ?? "The mailbox provider did not complete the connection.",
      tone: "warning",
    });
  }

  if (checkoutState === "success") {
    notices.push(
      currentSubscription
        ? {
            key: "checkout-success",
            title: `${formatPlanLabel(currentSubscription.planKey)} plan is now linked to this workspace`,
            description: `Plan status is ${formatStatusLabel(currentSubscription.status)} and billing management is now available.`,
            tone: "success",
          }
        : {
            key: "checkout-pending",
            title: checkoutSyncError ? "Payment completed but billing sync needs one more pass" : "Payment completed",
            description: checkoutSyncError ?? "Your purchase was confirmed. This page may take a moment to reflect the final plan status.",
            tone: checkoutSyncError ? "warning" : "muted",
          },
    );
  }

  if (checkoutState === "canceled") {
    notices.push({
      key: "checkout-canceled",
      title: "Checkout was canceled",
      description: "No billing changes were applied. You can restart checkout whenever you are ready.",
      tone: "muted",
    });
  }

  if (portalState === "return") {
    notices.push(
      currentSubscription
        ? {
            key: "portal-return",
            title: "Billing changes refreshed",
            description: `This workspace is currently ${formatStatusLabel(currentSubscription.status)} on the ${formatPlanLabel(currentSubscription.planKey)} plan.`,
            tone: "success",
          }
        : {
            key: "portal-return-pending",
            title: portalSyncError ? "Returned from billing management, but refresh needs attention" : "Returned from billing management",
            description: portalSyncError ?? "If you changed plans or payment details, the workspace billing status should refresh shortly.",
            tone: portalSyncError ? "warning" : "muted",
          },
    );
  }

  if (billingState === "refreshed") {
    notices.push({
      key: "billing-refreshed",
      title: currentSubscription ? "Workspace billing status refreshed" : "Billing refresh completed",
      description: currentSubscription
        ? `Current plan status: ${formatStatusLabel(currentSubscription.status)} on ${formatPlanLabel(currentSubscription.planKey)}.`
        : "We refreshed billing, but there is still no active subscription attached to this workspace.",
      tone: currentSubscription ? "success" : "muted",
    });
  }

  const launchTelemetry = viewer.workspace?.id && viewer.clerkUserId
    ? await recordLaunchChecklistTelemetry({
        organizationId: viewer.workspace.id,
        clerkUserId: viewer.clerkUserId,
        checklist,
      })
    : {
        recordedMilestones: 0,
        firstMilestoneAt: null,
        latestMilestone: null,
        recentMilestones: [],
        checklistCompletedAt: null,
        workspaceMemberCount: 0,
        trackedOperatorCount: 0,
        activeNudge: null,
      };

  const readiness = [
    {
      title: "Workspace access",
      status: flags.hasClerk ? "Ready" : "Needs attention",
      description: flags.hasClerk
        ? viewer.isAuthenticated
          ? `Signed in as ${viewer.displayName}. Your team can open the workspace now.`
          : "Secure sign-in is available. Sign in to manage team access."
        : "Finish secure sign-in so your team can open the workspace.",
    },
    {
      title: "Billing",
      status: flags.hasStripe ? "Ready" : "Needs attention",
      description: flags.hasStripe
        ? currentSubscription
          ? `Plan status: ${formatStatusLabel(currentSubscription.status)} on ${formatPlanLabel(currentSubscription.planKey)}.`
          : "Choose a plan to activate billing for this workspace."
        : "Finish billing access so this workspace can start a paid plan.",
    },
    {
      title: "Saved records",
      status: flags.hasDatabase ? "Ready" : "Needs attention",
      description: flags.hasDatabase
        ? viewer.workspace
          ? `Orders, activity, and settings are being saved for ${viewer.workspace.name}.`
          : "Saved order records are ready and will appear after sign-in."
        : "Turn on saved records so orders, activity, and settings can be stored.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="violet">Workspace settings</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Manage rollout, connections, and team workflow</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">
          Connect intake channels, confirm approvals and exports, and keep the workspace ready for customer rollout.
        </p>
      </div>

      {notices.length ? (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.key} className={cn("rounded-[24px] border px-4 py-4", getNoticeClasses(notice.tone))}>
              <p className="text-sm font-medium">{notice.title}</p>
              <p className="mt-1 text-sm opacity-80">{notice.description}</p>
            </div>
          ))}
        </div>
      ) : null}

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
                <Badge variant={item.status === "Ready" ? "success" : "muted"}>{item.status}</Badge>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>Account and access</CardTitle>
            <CardDescription>
              Confirm who is signed in to this workspace and end the session safely when you are done.
            </CardDescription>
          </div>
          <Badge variant={accessState === "READY" ? "success" : "muted"}>{formatAccessStateLabel(accessState)}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Signed in as: <span className="font-medium text-white">{viewer.displayName}</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Email: <span className="break-all font-medium text-white">{viewer.email ?? "No email available"}</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Workspace role: <span className="font-medium text-white">{viewer.workspace?.role ?? "Not assigned"}</span>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Access state: <span className="font-medium text-white">{formatAccessStateLabel(accessState)}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm text-white/58">{accessSummary}</p>
            {viewer.isConfigured ? (
              <SessionActionButton isAuthenticated={viewer.isAuthenticated} className="w-full sm:w-auto" />
            ) : null}
          </div>
        </CardContent>
      </Card>

      <LaunchChecklistExperience
        workspaceId={viewer.workspace?.id ?? null}
        workspaceName={viewer.workspace?.name ?? null}
        checklist={checklist}
        analytics={launchTelemetry}
        surface="settings"
      />

      <section id="guided-setup" className="scroll-mt-24">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>Guided launch setup</CardTitle>
              <CardDescription>
                Complete the rollout steps in order and jump straight to the next action.
              </CardDescription>
            </div>
            <Badge variant={checklistProgress.completed === checklistProgress.total ? "success" : "violet"}>
              {checklistProgress.completed}/{checklistProgress.total} complete
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {nextLaunchStep ? (
                <Button asChild className="w-full sm:w-auto">
                  <Link href={nextLaunchStep.href}>Continue with {nextLaunchStep.title}</Link>
                </Button>
              ) : (
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/dashboard">Launch checklist complete</Link>
                </Button>
              )}
              <Button asChild variant="secondary" className="w-full sm:w-auto"><Link href="/dashboard">Back to dashboard</Link></Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {settingsChecklistLinks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:bg-white/[0.06]"
                >
                  {item.title} <ArrowUpRight className="size-4" />
                </Link>
              ))}
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              {checklist.map((item, index) => {
                const isNextStep = !item.completed && nextLaunchStep?.key === item.key;

                return (
                  <div key={item.key} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-3">
                        <div className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/78">
                          {item.completed ? <CheckCircle2 className="size-4 text-emerald-300" /> : <CircleDashed className="size-4 text-violet-200" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-white">{index + 1}. {item.title}</p>
                            <Badge variant={item.completed ? "success" : isNextStep ? "violet" : "muted"}>
                              {item.completed ? "Done" : isNextStep ? "Next" : "Pending"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-white/68">{item.description}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{item.supportText}</p>
                        </div>
                      </div>
                      <Link
                        href={item.href}
                        className="inline-flex w-full shrink-0 self-start items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06] sm:w-auto"
                      >
                        {item.ctaLabel} <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="mailbox-provider-integration" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Mailbox connections</CardTitle>
          <CardDescription>
            Step 2 of launch: connect Gmail or Microsoft 365, run syncs, and keep inbound order coverage healthy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MailboxConnectionForm />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Connections: {inboxConnections.length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Scheduled sync: {inboxConnections.filter((item) => item.syncMode === "POLLING").length}
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
              Instant updates: {inboxConnections.filter((item) => item.syncMode === "WEBHOOK").length}
            </div>
          </div>
          {inboxConnections.length ? (
            inboxConnections.map((connection) => (
              <div key={connection.id} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-medium text-white">{connection.provider} · {connection.address}</p>
                    <p className="text-xs text-white/45">
                      {formatSyncMode(connection.syncMode)} · Last sync {connection.lastSyncedAt ? formatEventTimestamp(connection.lastSyncedAt) : "never"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto">
                    <MailboxSyncButton connectionId={connection.id} />
                    {connection.oauthConnected ? <MailboxTokenRefreshButton connectionId={connection.id} /> : null}
                    {connection.syncMode === "WEBHOOK" ? <MailboxBootstrapButton connectionId={connection.id} /> : null}
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  Access: {connection.oauthConnected ? "Secure sign-in complete" : connection.accessToken ? "Manual access saved" : "Needs attention"} · Connection details: {connection.accessToken ? "Saved securely" : "Not added"} · {connection.syncMode === "WEBHOOK" ? `Instant updates ${connection.webhookSecret ? "ready" : "need attention"}` : "Scheduled refresh active"}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  Mailbox updates: {formatStatusLabel(connection.providerSubscriptionStatus)} · Renews {connection.providerSubscriptionExpiresAt ? formatEventTimestamp(connection.providerSubscriptionExpiresAt) : "when started"}
                </p>
                {connection.lastError ? <p className="mt-2 text-sm text-amber-200/80">Latest connection issue: {connection.lastError}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No mailbox connections are live yet. Connect a shared inbox to start capturing inbound orders.
            </div>
          )}
        </CardContent>
      </Card>

      </section>

      <section id="erp-export-integration" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>ERP handoff</CardTitle>
          <CardDescription>
            Step 5 of launch: connect approved orders to a downstream system and retry failed handoffs safely.
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
                <p className="mt-1 break-all text-xs text-white/45">{connection.provider} · Destination {connection.endpointUrl}</p>
                <p className="mt-2 text-sm text-white/55">Secure access: {connection.authHeader ? "Saved securely" : "Not added"}</p>
                <p className="mt-1 text-sm text-white/55">
                  Order field matching: {connection.fieldMappings ? "Custom" : "Standard"} · Advanced options: {connection.adapterSettings ? "Added" : "Standard"}
                </p>
                {connection.lastError ? <p className="mt-2 text-sm text-amber-200/80">Latest handoff issue: {connection.lastError}</p> : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No ERP handoff is live yet. Add a destination before rollout.
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
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/55">
              No ERP handoffs have been attempted yet. Approved orders will appear here after export starts.
            </div>
          )}
        </CardContent>
      </Card>

      </section>

      <section id="review-workflow-policy" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Review workflow policy</CardTitle>
          <CardDescription>Control approval roles, thresholds, and reason codes for this workspace.</CardDescription>
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
              Finance threshold: {formatCurrencyFromCents(workflowSettings.policy.financeThresholdCents)}
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

      </section>

      <section id="workflow-notifications" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Workflow notifications</CardTitle>
          <CardDescription>Unread approval and export updates for your current workspace role.</CardDescription>
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
              No workflow updates are waiting for this workspace role.
            </div>
          )}
        </CardContent>
      </Card>

      </section>

      <section id="workspace-billing" className="scroll-mt-24 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace billing</CardTitle>
          <CardDescription>Step 6 of launch: confirm plan status and billing access before rollout.</CardDescription>
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
              Plan: {formatPlanLabel(activePlan)}
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            Billing status: {currentSubscription?.status ? formatStatusLabel(currentSubscription.status) : "No subscription has been recorded yet"}
            {currentSubscription?.planKey ? ` · ${formatPlanLabel(currentSubscription.planKey)}` : ""}
          </div>
          <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[auto_auto_minmax(0,1fr)] xl:items-start">
            <CustomerPortalButton isReady={hasPortalAccess} className="sm:w-auto" />
            {flags.hasStripe && viewer.workspace?.id ? <BillingSyncButton /> : null}
            <p className="text-sm text-white/55">
              {hasPortalAccess
                ? "Update payment details, switch plans, or cancel from billing management. If your purchase is already complete, use refresh to pull the latest plan status into this workspace."
                : "Billing management becomes available after the first completed plan purchase. Once payment finishes, this page will pull the latest plan status into the workspace."}
            </p>
          </div>
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
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-center text-sm text-white/55">
                      Change plans from billing management on the current subscription.
                    </div>
                  )
                ) : (
                  <SubscriptionButton planKey={plan.key} isCheckoutReady={flags.hasStripe} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      </section>
    </div>
  );
}

