import { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";
import { buildWorkspaceDraft } from "@/lib/workspace-core";

export type WorkspaceSnapshot = {
  id: string;
  name: string;
  slug: string;
  role: string;
  subscription: {
    planKey: string;
    status: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  } | null;
};

function toWorkspaceSnapshot(membership: {
  organizationId: string;
  role: string;
  organization: {
    name: string;
    slug: string;
    subscription: {
      planKey: string;
      status: string;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
    } | null;
  };
}): WorkspaceSnapshot {
  return {
    id: membership.organizationId,
    name: membership.organization.name,
    slug: membership.organization.slug,
    role: membership.role,
    subscription: membership.organization.subscription
      ? {
          planKey: membership.organization.subscription.planKey,
          status: membership.organization.subscription.status,
          stripeCustomerId: membership.organization.subscription.stripeCustomerId,
          stripeSubscriptionId: membership.organization.subscription.stripeSubscriptionId,
        }
      : null,
  };
}

type EnsureWorkspaceInput = {
  clerkUserId: string;
  clerkOrgId?: string | null;
  displayName: string;
  email: string;
};

export async function ensureWorkspaceForUser(
  input: EnsureWorkspaceInput,
): Promise<WorkspaceSnapshot | null> {
  if (!flags.hasDatabase) {
    return null;
  }

  const db = getDb();

  if (!db) {
    return null;
  }

  try {
    const membership = await db.membership.findFirst({
      where: { clerkUserId: input.clerkUserId },
      include: { organization: { include: { subscription: true } } },
    });

    if (membership) {
      return toWorkspaceSnapshot(membership);
    }

    const workspaceDraft = buildWorkspaceDraft({
      clerkUserId: input.clerkUserId,
      displayName: input.displayName,
      email: input.email,
    });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const slug = attempt === 0 ? workspaceDraft.slug : `${workspaceDraft.slug}-${attempt + 1}`;

      try {
        const createdMembership = await db.membership.create({
          data: {
            clerkUserId: input.clerkUserId,
            role: workspaceDraft.role,
            organization: {
              create: {
                name: workspaceDraft.name,
                slug,
                clerkOrgId: input.clerkOrgId ?? undefined,
              },
            },
          },
          include: { organization: { include: { subscription: true } } },
        });

        return toWorkspaceSnapshot(createdMembership);
      } catch (error) {
        const existingMembership = await db.membership.findFirst({
          where: { clerkUserId: input.clerkUserId },
          include: { organization: { include: { subscription: true } } },
        });

        if (existingMembership) {
          return toWorkspaceSnapshot(existingMembership);
        }

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002" &&
          Array.isArray(error.meta?.target) &&
          error.meta.target.includes("slug")
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Failed to allocate a unique workspace slug.");
  } catch (error) {
    console.error("Failed to load or bootstrap workspace.", error);
    return null;
  }
}