"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardLaunchChecklistItem } from "@/lib/dashboard-checklist-core";
import type { LaunchChecklistTelemetrySnapshot } from "@/lib/launch-telemetry";
import {
  createEmptyLaunchChecklistClientState,
  deriveLaunchChecklistExperience,
  dismissLaunchChecklistCelebration,
  type LaunchChecklistExperienceSnapshot,
} from "@/lib/launch-checklist-experience-core";

type LaunchChecklistExperienceProps = {
  workspaceId: string | null;
  workspaceName: string | null;
  checklist: DashboardLaunchChecklistItem[];
  analytics: LaunchChecklistTelemetrySnapshot;
  surface: "dashboard" | "settings";
};

function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "Not recorded yet";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function LaunchChecklistExperience({
  workspaceId,
  workspaceName,
  checklist,
  analytics,
  surface,
}: LaunchChecklistExperienceProps) {
  const storageKey = `orderpilot.launch-checklist:${workspaceId ?? "workspace"}`;
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const checklistSignature = useMemo(
    () => checklist.map((item) => `${item.key}:${item.completed ? 1 : 0}`).join("|"),
    [checklist],
  );
  const [experience, setExperience] = useState<LaunchChecklistExperienceSnapshot | null>(null);

  useEffect(() => {
    const nowISOString = new Date().toISOString();
    const previous = (() => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : createEmptyLaunchChecklistClientState();
      } catch {
        return createEmptyLaunchChecklistClientState();
      }
    })();
    const snapshot = deriveLaunchChecklistExperience({
      checklist,
      previousState: previous,
      nowISOString,
    });

    window.localStorage.setItem(storageKey, JSON.stringify(snapshot.state));
    const timeoutId = window.setTimeout(() => {
      setExperience(snapshot);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [storageKey, checklist, checklistSignature]);

  const recommendedStepKey = experience?.state.lastRecommendedStepKey ?? checklist.find((item) => !item.completed)?.key ?? null;
  const recommendedStep = checklist.find((item) => item.key === recommendedStepKey) ?? null;
  const latestCompletedKey = experience?.latestCompletedKey ?? analytics.latestMilestone?.key ?? null;
  const latestCompletedItem = checklist.find((item) => item.key === latestCompletedKey) ?? null;
  const latestCompletedAt = latestCompletedKey
    ? experience?.state.completedAtByKey[latestCompletedKey] ?? analytics.latestMilestone?.createdAt ?? null
    : analytics.latestMilestone?.createdAt ?? null;
  const recordedMilestones = Math.max(analytics.recordedMilestones, experience?.recordedMilestones ?? 0);
  const celebrationId = experience?.activeCelebrationId ?? null;
  const latestMilestones = analytics.recentMilestones.slice(0, surface === "dashboard" ? 2 : 4);
  const summaryGridClassName = surface === "dashboard"
    ? "grid gap-3"
    : "grid gap-3 xl:grid-cols-2 2xl:grid-cols-3";

  function dismissCelebration() {
    if (!experience || !celebrationId) {
      return;
    }

    const nextState = dismissLaunchChecklistCelebration(experience.state, celebrationId);
    window.localStorage.setItem(storageKey, JSON.stringify(nextState));
    setExperience({ ...experience, state: nextState, activeCelebrationId: null });
  }

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>{surface === "dashboard" ? "Launch momentum" : "Onboarding momentum"}</CardTitle>
            <CardDescription className="max-w-xl text-pretty">
              Track progress, celebrate wins, and keep the next action sticky until {workspaceName ?? "this workspace"} is truly launch-ready.
            </CardDescription>
          </div>
          <Badge variant="violet">Telemetry live</Badge>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        {celebrationId ? (
          <div className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 gap-3">
                <div className="mt-1 rounded-full bg-emerald-300/15 p-2 text-emerald-200"><Sparkles className="size-4" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {celebrationId === "launch-ready"
                      ? "Launch checklist complete"
                      : `Milestone unlocked: ${checklist.find((item) => `step:${item.key}` === celebrationId)?.title ?? "Launch milestone"}`}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {celebrationId === "launch-ready"
                      ? "Every core go-live step is done. Now the mission is proving daily operator value and customer outcomes."
                      : "OrderPilot noticed a real onboarding win and updated the recommended next action automatically."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendedStep ? (
                  <Button asChild size="sm"><Link href={recommendedStep.href}>{recommendedStep.ctaLabel}</Link></Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={dismissCelebration}>Dismiss</Button>
              </div>
            </div>
          </div>
        ) : null}

        {analytics.activeNudge ? (
          <div className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Recovery nudge</p>
                <p className="mt-1 text-sm leading-6 text-white/72">{analytics.activeNudge.body}</p>
                <p className="mt-2 text-xs text-white/42">Created {formatDateTime(analytics.activeNudge.createdAt)}</p>
              </div>
              <Button asChild size="sm"><Link href={analytics.activeNudge.route}>Resume setup</Link></Button>
            </div>
          </div>
        ) : null}

        <div className={summaryGridClassName}>
          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-white">Workspace launch progress</p>
            <p className="mt-3 text-3xl font-semibold text-white">{completedCount}/{totalCount}</p>
            <p className="mt-1 text-sm text-white/62">Live checklist milestones complete across the workspace.</p>
            <p className="mt-2 text-xs text-white/42">
              Team telemetry from {analytics.trackedOperatorCount || 0} of {analytics.workspaceMemberCount || 0} teammate{analytics.workspaceMemberCount === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-cyan-400/15 p-2 text-cyan-200"><TrendingUp className="size-4" /></div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Recommended next action</p>
                <p className="mt-1 text-sm leading-6 text-white/62">
                  {recommendedStep
                    ? `${recommendedStep.title} is being kept front-and-center until it’s done.`
                    : "The launch checklist is complete. Keep proving usage and customer trust."}
                </p>
                {recommendedStep ? (
                  <Link href={recommendedStep.href} className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200">
                    {recommendedStep.ctaLabel} <ArrowUpRight className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-emerald-300/15 p-2 text-emerald-200"><CheckCircle2 className="size-4" /></div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Recent win</p>
                <p className="mt-1 text-sm leading-6 text-white/62">
                  {latestCompletedItem?.title ?? analytics.latestMilestone?.title ?? "No launch milestone recorded yet."}
                </p>
                <p className="mt-2 text-xs text-white/42">{formatDateTime(latestCompletedAt)}</p>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-white">Launch-readiness analytics</p>
            <p className="mt-3 text-3xl font-semibold text-white">{recordedMilestones}</p>
            <p className="mt-1 text-sm text-white/62">Workspace milestone{recordedMilestones === 1 ? "" : "s"} recorded so far.</p>
            <p className="mt-2 text-xs text-white/42">
              Started {formatDateTime(experience?.state.trackedAt ?? analytics.firstMilestoneAt)}
            </p>
          </div>
        </div>

        {latestMilestones.length ? (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-white">Recent workspace milestones</p>
            <div className="mt-3 space-y-3">
              {latestMilestones.map((milestone) => (
                <div key={`${milestone.key}-${milestone.createdAt}`} className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-white/72">{milestone.title}</p>
                    <p className="mt-1 text-xs text-white/42">{formatDateTime(milestone.createdAt)}</p>
                  </div>
                  {milestone.route ? (
                    <Link href={milestone.route} className="shrink-0 text-sm text-cyan-200">Open</Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}