import { randomUUID } from "node:crypto";
import { InboxProvider } from "@/generated/prisma/enums";
import { decryptField, encryptField } from "@/lib/crypto";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";
import {
  buildOrderInputFromMailboxMessage,
  isNewerMailboxCursor,
  maskSecret,
  parseSenderHeader,
  type MailboxProviderKey,
  type NormalizedMailboxMessage,
} from "@/lib/inbox-core";
import {
  buildGmailWatchRequest,
  buildMailboxAuthorizeUrl,
  buildMailboxOAuthRedirectUri,
  buildMicrosoftSubscriptionRenewalRequest,
  buildMicrosoftSubscriptionRequest,
  decodeMailboxOAuthState,
  encodeMailboxOAuthState,
  getMailboxOAuthScopes,
  normalizeTokenExpiry,
  type OAuthMailboxProvider,
} from "@/lib/mailbox-oauth-core";
import { isDuplicateExternalRefConstraintError } from "@/lib/order-write-core";
import { createWorkspaceOrder } from "@/lib/orders";

type InboxActor = { clerkUserId?: string | null; name?: string | null; role?: string | null };

type UpsertInboxConnectionInput = {
  provider: MailboxProviderKey;
  address: string;
  syncMode: "POLLING" | "WEBHOOK";
  accessToken?: string | null;
  refreshToken?: string | null;
  tokenType?: string | null;
  tokenExpiresAt?: Date | null;
  scope?: string | null;
  externalAccountId?: string | null;
  cursor?: string | null;
  webhookSecret?: string | null;
  oauthMetadata?: Record<string, string | null> | null;
  isActive?: boolean;
};

type GmailPayloadPart = {
  headers?: Array<{ name: string; value: string }>;
  body?: { data?: string | null };
  parts?: GmailPayloadPart[];
};

type InboxConnectionRecord = {
  id: string;
  organizationId: string;
  provider: InboxProvider;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: string | null;
  tokenExpiresAt: Date | null;
  scope: string | null;
  externalAccountId: string | null;
  cursor: string | null;
  webhookSecret: string | null;
  syncMode: "POLLING" | "WEBHOOK";
  isActive: boolean;
};

function getMailboxOAuthStateSecret() {
  const secret = env.MAILBOX_OAUTH_STATE_SECRET ?? env.CLERK_SECRET_KEY;

  if (!secret) {
    throw new Error("Mailbox OAuth state secret is not configured.");
  }

  return secret;
}

function getAppUrl() {
  if (!env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL must be configured for mailbox OAuth.");
  }

  return env.NEXT_PUBLIC_APP_URL;
}

function getOAuthProviderConfig(provider: OAuthMailboxProvider) {
  if (provider === "GMAIL") {
    if (!env.GMAIL_OAUTH_CLIENT_ID || !env.GMAIL_OAUTH_CLIENT_SECRET) {
      throw new Error("Gmail OAuth is not configured.");
    }

    return {
      clientId: env.GMAIL_OAUTH_CLIENT_ID,
      clientSecret: env.GMAIL_OAUTH_CLIENT_SECRET,
      scope: getMailboxOAuthScopes(provider, env.GMAIL_OAUTH_SCOPES),
      tokenUrl: "https://oauth2.googleapis.com/token",
      tenantId: null,
    };
  }

  if (!env.MICROSOFT_ENTRA_CLIENT_ID || !env.MICROSOFT_ENTRA_CLIENT_SECRET) {
    throw new Error("Microsoft Entra OAuth is not configured.");
  }

  const tenantId = env.MICROSOFT_ENTRA_TENANT_ID?.trim() || "common";

  return {
    clientId: env.MICROSOFT_ENTRA_CLIENT_ID,
    clientSecret: env.MICROSOFT_ENTRA_CLIENT_SECRET,
    scope: getMailboxOAuthScopes(provider, env.MICROSOFT_GRAPH_SCOPES),
    tokenUrl: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    tenantId,
  };
}

function decodeGmailBody(data: string | null | undefined) {
  if (!data) {
    return "";
  }

  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function extractGmailBody(payload: GmailPayloadPart | undefined): string {
  if (!payload) {
    return "";
  }

  const direct = decodeGmailBody(payload.body?.data);

  if (direct) {
    return direct;
  }

  for (const part of payload.parts ?? []) {
    const nested = extractGmailBody(part);
    if (nested) {
      return nested;
    }
  }

  return "";
}

async function exchangeMailboxOAuthCode(provider: OAuthMailboxProvider, code: string) {
  const config = getOAuthProviderConfig(provider);
  const redirectUri = buildMailboxOAuthRedirectUri(getAppUrl(), provider);
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      scope: config.scope,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mailbox OAuth token exchange failed with ${response.status}.`);
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
  };
}

async function refreshMailboxToken(connection: NonNullable<InboxConnectionRecord>) {
  if (!connection.refreshToken) {
    throw new Error("Mailbox connection is missing a refresh token.");
  }

  const provider = connection.provider as OAuthMailboxProvider;
  const config = getOAuthProviderConfig(provider);
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: connection.refreshToken,
      grant_type: "refresh_token",
      scope: config.scope,
    }),
  });

  if (!response.ok) {
    throw new Error(`Mailbox token refresh failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
  };
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  return db.inboxConnection.update({
    where: { id: connection.id },
    data: {
      accessToken: encryptField(payload.access_token),
      refreshToken: encryptField(payload.refresh_token ?? connection.refreshToken),
      tokenType: payload.token_type ?? connection.tokenType ?? undefined,
      tokenExpiresAt: normalizeTokenExpiry(payload.expires_in) ?? undefined,
      scope: payload.scope ?? connection.scope ?? undefined,
      lastError: null,
    },
  });
}

async function ensureFreshMailboxToken(connection: NonNullable<InboxConnectionRecord>) {
  if (!connection.accessToken) {
    throw new Error("Inbox connection is missing an access token.");
  }

  if (connection.tokenExpiresAt && connection.tokenExpiresAt.getTime() <= Date.now() + 60_000) {
    const refreshed = await refreshMailboxToken(connection);
    return decryptField(refreshed.accessToken) ?? connection.accessToken;
  }

  // Decrypt before returning — token may be stored encrypted.
  return decryptField(connection.accessToken) ?? connection.accessToken;
}

async function fetchMailboxProfile(provider: OAuthMailboxProvider, accessToken: string) {
  if (provider === "GMAIL") {
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Gmail profile lookup failed with ${response.status}.`);
    }

    const payload = (await response.json()) as { emailAddress?: string; historyId?: string };
    return {
      address: payload.emailAddress ?? null,
      externalAccountId: payload.emailAddress ?? null,
      cursor: payload.historyId ?? null,
      oauthMetadata: null,
    };
  }

  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me?$select=id,displayName,userPrincipalName,mail",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    throw new Error(`Microsoft 365 profile lookup failed with ${response.status}.`);
  }

  const payload = (await response.json()) as {
    id?: string;
    displayName?: string;
    userPrincipalName?: string;
    mail?: string;
  };

  return {
    address: payload.mail ?? payload.userPrincipalName ?? null,
    externalAccountId: payload.id ?? null,
    cursor: null,
    oauthMetadata: {
      displayName: payload.displayName ?? null,
      userPrincipalName: payload.userPrincipalName ?? null,
    },
  };
}

async function fetchGmailMessages(accessToken: string) {
  // Paginate through ALL inbox messages, not just the first page of 10.
  const allMessageIds: string[] = [];
  let nextPageToken: string | undefined;

  do {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("q", "in:inbox");
    if (nextPageToken) {
      url.searchParams.set("pageToken", nextPageToken);
    }

    const listResponse = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!listResponse.ok) {
      throw new Error(`Gmail sync failed with ${listResponse.status}.`);
    }

    const listPayload = (await listResponse.json()) as {
      messages?: Array<{ id: string }>;
      nextPageToken?: string;
    };

    for (const msg of listPayload.messages ?? []) {
      allMessageIds.push(msg.id);
    }

    nextPageToken = listPayload.nextPageToken;
  } while (nextPageToken);

  return fetchGmailMessagesByIds(accessToken, allMessageIds);
}

async function fetchGmailMessagesByIds(accessToken: string, messageIds: string[]) {
  const dedupedIds = [...new Set(messageIds.filter(Boolean))];
  const messages = await Promise.all(
    dedupedIds.map(async (id) => {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Gmail message fetch failed with ${response.status}.`);
      }

      const payload = (await response.json()) as {
        id: string;
        snippet?: string;
        internalDate?: string;
        payload?: GmailPayloadPart;
      };
      const headers = Object.fromEntries(
        (payload.payload?.headers ?? []).map((header) => [header.name.toLowerCase(), header.value]),
      );
      const sender = parseSenderHeader(headers.from);

      return {
        provider: InboxProvider.GMAIL,
        externalMessageId: payload.id,
        fromEmail: sender.email,
        fromName: sender.name,
        subject: headers.subject ?? payload.snippet ?? "Gmail order request",
        bodyText: extractGmailBody(payload.payload) || payload.snippet || "",
        receivedAt: payload.internalDate ? new Date(Number(payload.internalDate)).toISOString() : null,
      } satisfies NormalizedMailboxMessage;
    }),
  );

  return messages.flatMap((message) => (message ? [message] : []));
}

async function fetchGmailHistoryMessageIds(accessToken: string, startHistoryId: string) {
  const messageIds = new Set<string>();
  let nextPageToken: string | undefined;
  let latestHistoryId: string | null = null;

  do {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/history");
    url.searchParams.set("startHistoryId", startHistoryId);
    url.searchParams.set("historyTypes", "messageAdded");

    if (nextPageToken) {
      url.searchParams.set("pageToken", nextPageToken);
    }

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (response.status === 404) {
      return { kind: "stale" as const, messageIds: [], latestHistoryId: null };
    }

    if (!response.ok) {
      throw new Error(`Gmail history sync failed with ${response.status}.`);
    }

    const payload = (await response.json()) as {
      history?: Array<{ messagesAdded?: Array<{ message?: { id?: string | null } | null }> }>;
      historyId?: string;
      nextPageToken?: string;
    };

    latestHistoryId = payload.historyId ?? latestHistoryId;
    nextPageToken = payload.nextPageToken;

    for (const entry of payload.history ?? []) {
      for (const added of entry.messagesAdded ?? []) {
        const messageId = added.message?.id?.trim();

        if (messageId) {
          messageIds.add(messageId);
        }
      }
    }
  } while (nextPageToken);

  return { kind: "ok" as const, messageIds: [...messageIds], latestHistoryId };
}

async function fetchMicrosoftMessageBody(accessToken: string, messageId: string): Promise<string> {
  // Fetch the full plain-text body of a single message (avoids 255-char bodyPreview truncation).
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages/${messageId}?$select=body`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'outlook.body-content-type="text"',
      },
    },
  );

  if (!response.ok) {
    // Non-fatal: fall back to empty string; the message will get flagged as needing extraction.
    return "";
  }

  const payload = (await response.json()) as { body?: { content?: string } };
  return payload.body?.content?.trim() ?? "";
}

async function fetchMicrosoftMessages(accessToken: string) {
  // Paginate through ALL inbox messages using @odata.nextLink.
  const allMessages: Array<{
    id: string;
    subject?: string;
    bodyPreview?: string;
    receivedDateTime?: string;
    from?: { emailAddress?: { address?: string; name?: string } };
  }> = [];

  let nextUrl: string | undefined =
    "https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages" +
    "?$top=50&$select=id,subject,from,bodyPreview,receivedDateTime";

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'outlook.body-content-type="text"',
      },
    });

    if (!response.ok) {
      throw new Error(`Microsoft 365 sync failed with ${response.status}.`);
    }

    const payload = (await response.json()) as {
      value?: typeof allMessages;
      "@odata.nextLink"?: string;
    };

    for (const msg of payload.value ?? []) {
      allMessages.push(msg);
    }

    nextUrl = payload["@odata.nextLink"];
  }

  // Fetch full body for each message in parallel (batched to avoid rate limits).
  const BATCH_SIZE = 5;
  const result: NormalizedMailboxMessage[] = [];

  for (let i = 0; i < allMessages.length; i += BATCH_SIZE) {
    const batch = allMessages.slice(i, i + BATCH_SIZE);
    const bodies = await Promise.all(
      batch.map((msg) => fetchMicrosoftMessageBody(accessToken, msg.id)),
    );
    for (const [j, message] of batch.entries()) {
      result.push({
        provider: InboxProvider.MICROSOFT365,
        externalMessageId: message.id,
        fromEmail: message.from?.emailAddress?.address?.toLowerCase() ?? "unknown@inbox.local",
        fromName: message.from?.emailAddress?.name ?? "Microsoft 365 sender",
        subject: message.subject ?? "Microsoft 365 order request",
        // Use full body; fall back to bodyPreview only if full body fetch returned empty.
        bodyText: bodies[j] || message.bodyPreview || "",
        receivedAt: message.receivedDateTime ?? null,
      });
    }
  }

  return result;
}

async function ingestNormalizedMessages(input: {
  organizationId: string;
  messages: NormalizedMailboxMessage[];
  actor?: InboxActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const createdOrderIds: string[] = [];

  for (const message of input.messages) {
    const externalRef = `${message.provider}-${message.externalMessageId}`;
    const existing = await db.order.findUnique({
      where: { organizationId_externalRef: { organizationId: input.organizationId, externalRef } },
      select: { externalRef: true },
    });

    if (existing) {
      continue;
    }

    try {
      const orderId = await createWorkspaceOrder(input.organizationId, {
        ...buildOrderInputFromMailboxMessage(message),
        actor: input.actor,
      });
      createdOrderIds.push(orderId);
    } catch (error) {
      if (isDuplicateExternalRefConstraintError(error)) {
        continue;
      }

      throw error;
    }
  }

  return createdOrderIds;
}

export function getMailboxOAuthStartUrl(input: {
  organizationId: string;
  provider: OAuthMailboxProvider;
  address?: string | null;
  syncMode: "POLLING" | "WEBHOOK";
}) {
  const config = getOAuthProviderConfig(input.provider);
  const redirectUri = buildMailboxOAuthRedirectUri(getAppUrl(), input.provider);
  const state = encodeMailboxOAuthState(
    {
      workspaceId: input.organizationId,
      provider: input.provider,
      address: input.address ?? null,
      syncMode: input.syncMode,
      issuedAt: Date.now(),
    },
    getMailboxOAuthStateSecret(),
  );

  return buildMailboxAuthorizeUrl({
    provider: input.provider,
    clientId: config.clientId,
    redirectUri,
    state,
    scope: config.scope,
    tenantId: config.tenantId,
    loginHint: input.address ?? null,
  });
}

export function parseMailboxOAuthState(state: string) {
  return decodeMailboxOAuthState(state, getMailboxOAuthStateSecret());
}

export async function upsertInboxConnection(organizationId: string, input: UpsertInboxConnectionInput) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  return db.inboxConnection.upsert({
    where: {
      organizationId_provider_address: {
        organizationId,
        provider: input.provider,
        address: input.address,
      },
    },
    create: {
      organizationId,
      provider: input.provider,
      address: input.address,
      syncMode: input.syncMode,
      accessToken: encryptField(input.accessToken) ?? undefined,
      refreshToken: encryptField(input.refreshToken) ?? undefined,
      tokenType: input.tokenType ?? undefined,
      tokenExpiresAt: input.tokenExpiresAt ?? undefined,
      scope: input.scope ?? undefined,
      externalAccountId: input.externalAccountId ?? undefined,
      cursor: input.cursor ?? undefined,
      webhookSecret: input.webhookSecret ?? undefined,
      oauthMetadata: input.oauthMetadata ?? undefined,
      isActive: input.isActive ?? true,
    },
    update: {
      syncMode: input.syncMode,
      accessToken: encryptField(input.accessToken) ?? undefined,
      refreshToken: encryptField(input.refreshToken) ?? undefined,
      tokenType: input.tokenType ?? undefined,
      tokenExpiresAt: input.tokenExpiresAt ?? undefined,
      scope: input.scope ?? undefined,
      externalAccountId: input.externalAccountId ?? undefined,
      cursor: input.cursor ?? undefined,
      webhookSecret: input.webhookSecret ?? undefined,
      oauthMetadata: input.oauthMetadata ?? undefined,
      isActive: input.isActive ?? true,
      lastError: null,
    },
  });
}

export async function completeMailboxOAuth(input: {
  organizationId: string;
  provider: OAuthMailboxProvider;
  code: string;
  addressHint?: string | null;
  syncMode: "POLLING" | "WEBHOOK";
}) {
  const tokenPayload = await exchangeMailboxOAuthCode(input.provider, input.code);
  const profile = await fetchMailboxProfile(input.provider, tokenPayload.access_token);
  const address = profile.address ?? input.addressHint;

  if (!address) {
    throw new Error("Mailbox provider did not return an email address.");
  }

  const connection = await upsertInboxConnection(input.organizationId, {
    provider: input.provider,
    address,
    syncMode: input.syncMode,
    accessToken: tokenPayload.access_token,
    refreshToken: tokenPayload.refresh_token ?? null,
    tokenType: tokenPayload.token_type ?? null,
    tokenExpiresAt: normalizeTokenExpiry(tokenPayload.expires_in),
    scope: tokenPayload.scope ?? null,
    externalAccountId: profile.externalAccountId,
    cursor: profile.cursor,
    webhookSecret: randomUUID(),
    oauthMetadata: profile.oauthMetadata,
  });

  if (input.syncMode === "WEBHOOK") {
    try {
      await bootstrapInboxConnectionSubscription({ organizationId: input.organizationId, connectionId: connection.id });
    } catch (error) {
      const db = getDb();
      if (db) {
        await db.inboxConnection.update({
          where: { id: connection.id },
          data: { lastError: error instanceof Error ? error.message : "Mailbox bootstrap failed." },
        });
      }
    }
  }

  return connection;
}

export async function getWorkspaceInboxConnections(organizationId: string | null | undefined) {
  const db = getDb();

  if (!db || !organizationId) {
    return [];
  }

  const connections = await db.inboxConnection.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });

  return connections.map((connection) => ({
    ...connection,
    accessToken: maskSecret(connection.accessToken),
    refreshToken: maskSecret(connection.refreshToken),
    webhookSecret: maskSecret(connection.webhookSecret),
    oauthConnected: Boolean(connection.accessToken),
  }));
}

export async function refreshInboxConnectionToken(input: { organizationId: string; connectionId: string }) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const connection = await db.inboxConnection.findFirst({
    where: { id: input.connectionId, organizationId: input.organizationId, isActive: true },
  });

  if (!connection) {
    throw new Error("Inbox connection not found.");
  }

  return refreshMailboxToken(connection);
}

export async function bootstrapInboxConnectionSubscription(input: {
  organizationId: string;
  connectionId: string;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const connection = await db.inboxConnection.findFirst({
    where: { id: input.connectionId, organizationId: input.organizationId, isActive: true },
  });

  if (!connection) {
    throw new Error("Inbox connection not found.");
  }

  const accessToken = await ensureFreshMailboxToken(connection);

  if (connection.provider === InboxProvider.GMAIL) {
    if (!env.GMAIL_PUBSUB_TOPIC) {
      throw new Error("GMAIL_PUBSUB_TOPIC must be configured to bootstrap Gmail watch subscriptions.");
    }

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/watch", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildGmailWatchRequest(env.GMAIL_PUBSUB_TOPIC)),
    });

    if (!response.ok) {
      throw new Error(`Gmail subscription bootstrap failed with ${response.status}.`);
    }

    const payload = (await response.json()) as { historyId?: string; expiration?: string };
    return db.inboxConnection.update({
      where: { id: connection.id },
      data: {
        cursor: payload.historyId ?? connection.cursor ?? undefined,
        providerSubscriptionStatus: "ACTIVE",
        providerSubscriptionExpiresAt: payload.expiration ? new Date(Number(payload.expiration)) : undefined,
        lastBootstrapAt: new Date(),
        lastError: null,
      },
    });
  }

  const webhookSecret = connection.webhookSecret ?? randomUUID();
  const renewalRequest = buildMicrosoftSubscriptionRenewalRequest();

  if (connection.providerSubscriptionId) {
    const renewalResponse = await fetch(
      `https://graph.microsoft.com/v1.0/subscriptions/${connection.providerSubscriptionId}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify(renewalRequest),
      },
    );

    if (renewalResponse.ok) {
      const payload = (await renewalResponse.json()) as { id?: string; expirationDateTime?: string };
      return db.inboxConnection.update({
        where: { id: connection.id },
        data: {
          webhookSecret,
          providerSubscriptionId: payload.id ?? connection.providerSubscriptionId,
          providerSubscriptionStatus: "ACTIVE",
          providerSubscriptionExpiresAt: payload.expirationDateTime
            ? new Date(payload.expirationDateTime)
            : undefined,
          lastBootstrapAt: new Date(),
          lastError: null,
        },
      });
    }
  }

  const notificationUrl = new URL(`/api/inbox/connections/${connection.id}/webhook`, getAppUrl()).toString();
  const response = await fetch("https://graph.microsoft.com/v1.0/subscriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(buildMicrosoftSubscriptionRequest(notificationUrl, webhookSecret)),
  });

  if (!response.ok) {
    throw new Error(`Microsoft subscription bootstrap failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { id?: string; expirationDateTime?: string };
  return db.inboxConnection.update({
    where: { id: connection.id },
    data: {
      webhookSecret,
      providerSubscriptionId: payload.id ?? undefined,
      providerSubscriptionStatus: "ACTIVE",
      providerSubscriptionExpiresAt: payload.expirationDateTime ? new Date(payload.expirationDateTime) : undefined,
      lastBootstrapAt: new Date(),
      lastError: null,
    },
  });
}

export async function syncInboxConnection(input: {
  organizationId: string;
  connectionId: string;
  actor?: InboxActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const connection = await db.inboxConnection.findFirst({
    where: { id: input.connectionId, organizationId: input.organizationId, isActive: true },
  });

  if (!connection) {
    throw new Error("Inbox connection not found.");
  }

  try {
    const accessToken = await ensureFreshMailboxToken(connection);
    const messages = connection.provider === InboxProvider.GMAIL
      ? await fetchGmailMessages(accessToken)
      : connection.provider === InboxProvider.MICROSOFT365
        ? await fetchMicrosoftMessages(accessToken)
        : [];
    const orderIds = await ingestNormalizedMessages({ organizationId: input.organizationId, messages, actor: input.actor });

    await db.inboxConnection.update({
      where: { id: connection.id },
      data: { lastSyncedAt: new Date(), lastError: null },
    });

    return { syncedMessages: messages.length, createdOrders: orderIds };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbox sync failed.";
    await db.inboxConnection.update({ where: { id: connection.id }, data: { lastError: message } });
    throw error;
  }
}

export async function ingestWebhookMessages(input: {
  organizationId: string;
  connectionId: string;
  secret: string;
  messages: NormalizedMailboxMessage[];
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const connection = await db.inboxConnection.findFirst({
    where: { id: input.connectionId, organizationId: input.organizationId, isActive: true },
  });

  if (!connection) {
    throw new Error("Inbox connection not found.");
  }

  if (!connection.webhookSecret || connection.webhookSecret !== input.secret) {
    throw new Error("Invalid inbox webhook secret.");
  }

  const createdOrders = await ingestNormalizedMessages({
    organizationId: input.organizationId,
    messages: input.messages,
    actor: { name: `${connection.provider} webhook` },
  });

  await db.inboxConnection.update({
    where: { id: connection.id },
    data: { lastSyncedAt: new Date(), lastError: null },
  });

  return createdOrders;
}

export async function processInboxProviderNotification(input: {
  connectionId: string;
  payload: Record<string, unknown>;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const connection = await db.inboxConnection.findUnique({ where: { id: input.connectionId } });

  if (!connection) {
    throw new Error("Inbox connection not found.");
  }

  const entries = Array.isArray(input.payload.value) ? input.payload.value : [];

  if (connection.provider === InboxProvider.MICROSOFT365 && entries.length > 0) {
    const invalid = entries.some((entry) => {
      if (!entry || typeof entry !== "object") {
        return true;
      }

      return "clientState" in entry && entry.clientState !== connection.webhookSecret;
    });

    if (invalid) {
      throw new Error("Invalid Microsoft Graph client state.");
    }

    return syncInboxConnection({
      organizationId: connection.organizationId,
      connectionId: connection.id,
      actor: { name: "Microsoft Graph webhook" },
    });
  }

  throw new Error("Unsupported inbox provider notification payload.");
}

export async function processGmailPushNotification(input: {
  emailAddress: string;
  historyId: string;
  pubsubMessageId?: string | null;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const normalizedAddress = input.emailAddress.trim().toLowerCase();
  const connections = await db.inboxConnection.findMany({
    where: {
      provider: InboxProvider.GMAIL,
      syncMode: "WEBHOOK",
      isActive: true,
      OR: [
        { address: normalizedAddress },
        { externalAccountId: normalizedAddress },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  const result = {
    emailAddress: normalizedAddress,
    historyId: input.historyId,
    pubsubMessageId: input.pubsubMessageId ?? null,
    matchedConnections: connections.length,
    processedConnections: 0,
    skippedConnections: 0,
    syncedMessages: 0,
    createdOrders: [] as string[],
  };

  for (const connection of connections) {
    if (!isNewerMailboxCursor(input.historyId, connection.cursor)) {
      result.skippedConnections += 1;
      continue;
    }

    try {
      const accessToken = await ensureFreshMailboxToken(connection);

      if (connection.cursor) {
        const history = await fetchGmailHistoryMessageIds(accessToken, connection.cursor);

        if (history.kind === "ok") {
          const messages = await fetchGmailMessagesByIds(accessToken, history.messageIds);
          const createdOrderIds = await ingestNormalizedMessages({
            organizationId: connection.organizationId,
            messages,
            actor: { name: "Gmail Pub/Sub webhook" },
          });

          await db.inboxConnection.update({
            where: { id: connection.id },
            data: {
              cursor: history.latestHistoryId ?? input.historyId,
              lastSyncedAt: new Date(),
              lastError: null,
            },
          });

          result.processedConnections += 1;
          result.syncedMessages += messages.length;
          result.createdOrders.push(...createdOrderIds);
          continue;
        }
      }

      const fallbackResult = await syncInboxConnection({
        organizationId: connection.organizationId,
        connectionId: connection.id,
        actor: { name: "Gmail Pub/Sub webhook" },
      });

      await db.inboxConnection.update({
        where: { id: connection.id },
        data: { cursor: input.historyId, lastError: null },
      });

      result.processedConnections += 1;
      result.syncedMessages += fallbackResult.syncedMessages;
      result.createdOrders.push(...fallbackResult.createdOrders);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gmail Pub/Sub processing failed.";
      await db.inboxConnection.update({ where: { id: connection.id }, data: { lastError: message } });
      throw error;
    }
  }

  return result;
}

export async function renewInboxConnectionSubscriptions(input?: {
  organizationId?: string;
  renewWithinMinutes?: number;
  force?: boolean;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const renewWithinMinutes = input?.renewWithinMinutes ?? 12 * 60;
  const renewBefore = new Date(Date.now() + renewWithinMinutes * 60_000);
  const connections = await db.inboxConnection.findMany({
    where: {
      isActive: true,
      syncMode: "WEBHOOK",
      ...(input?.organizationId ? { organizationId: input.organizationId } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const dueConnections = input?.force
    ? connections
    : connections.filter(
        (connection) =>
          !connection.providerSubscriptionExpiresAt ||
          connection.providerSubscriptionExpiresAt <= renewBefore ||
          connection.providerSubscriptionStatus !== "ACTIVE",
      );

  const results: Array<{
    connectionId: string;
    provider: InboxProvider;
    ok: boolean;
    expiresAt: string | null;
    error?: string;
  }> = [];

  for (const connection of dueConnections) {
    try {
      const updated = await bootstrapInboxConnectionSubscription({
        organizationId: connection.organizationId,
        connectionId: connection.id,
      });
      results.push({
        connectionId: connection.id,
        provider: connection.provider,
        ok: true,
        expiresAt: updated.providerSubscriptionExpiresAt?.toISOString() ?? null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Mailbox subscription renewal failed.";
      await db.inboxConnection.update({ where: { id: connection.id }, data: { lastError: message } });
      results.push({
        connectionId: connection.id,
        provider: connection.provider,
        ok: false,
        expiresAt: connection.providerSubscriptionExpiresAt?.toISOString() ?? null,
        error: message,
      });
    }
  }

  return {
    renewWithinMinutes,
    processedConnections: dueConnections.length,
    renewedConnections: results.filter((item) => item.ok).length,
    failedConnections: results.filter((item) => !item.ok).length,
    results,
  };
}