import { encryptSecret, decryptSecret } from "@/lib/crypto/token-cipher";
import { createServiceClient } from "@/lib/supabase/service";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const DRIVE_FILES_API = "https://www.googleapis.com/drive/v3/files";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/drive.file",
  "email",
  "profile",
].join(" ");

function getRedirectUri() {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/api/integrations/google/callback`;
}

export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
}

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  error?: string;
}

async function fetchGoogleTokens(
  params: Record<string, string>
): Promise<GoogleTokenResponse> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  return res.json();
}

async function getGoogleEmail(accessToken: string): Promise<string> {
  const res = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  return data.email ?? "";
}

export async function storeGoogleTokens(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<{ google_email: string }> {
  const db = createServiceClient();
  const expiryDate = new Date(Date.now() + expiresIn * 1000).toISOString();
  const email = await getGoogleEmail(accessToken);

  const { error } = await db.from("google_connections").upsert(
    {
      user_id: userId,
      encrypted_access_token: encryptSecret(accessToken),
      encrypted_refresh_token: encryptSecret(refreshToken),
      token_expiry: expiryDate,
      google_email: email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
  return { google_email: email };
}

export async function exchangeGoogleCode(
  code: string,
  userId: string
): Promise<{ google_email: string }> {
  const tokens = await fetchGoogleTokens({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: getRedirectUri(),
    grant_type: "authorization_code",
  });

  if (tokens.error || !tokens.access_token || !tokens.refresh_token) {
    throw new Error(`Google OAuth falhou: ${tokens.error ?? "sem refresh token"}`);
  }

  return storeGoogleTokens(userId, tokens.access_token, tokens.refresh_token, tokens.expires_in);
}

async function refreshGoogleToken(
  userId: string,
  encryptedRefreshToken: string
): Promise<string> {
  const refreshToken = decryptSecret(encryptedRefreshToken);
  const tokens = await fetchGoogleTokens({
    refresh_token: refreshToken,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  if (tokens.error || !tokens.access_token) {
    throw new Error(`Refresh token Google falhou: ${tokens.error}`);
  }

  const db = createServiceClient();
  const expiryDate = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  await db
    .from("google_connections")
    .update({
      encrypted_access_token: encryptSecret(tokens.access_token),
      token_expiry: expiryDate,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return tokens.access_token;
}

export async function getValidAccessToken(userId: string): Promise<string | null> {
  const db = createServiceClient();
  const { data } = await db
    .from("google_connections")
    .select("encrypted_access_token, encrypted_refresh_token, token_expiry")
    .eq("user_id", userId)
    .single();

  if (!data) return null;

  const expiresAt = new Date(data.token_expiry).getTime();
  const bufferMs = 60 * 1000;

  if (Date.now() < expiresAt - bufferMs) {
    return decryptSecret(data.encrypted_access_token);
  }

  return refreshGoogleToken(userId, data.encrypted_refresh_token);
}

export async function getGoogleConnection(
  userId: string
): Promise<{ google_email: string } | null> {
  const db = createServiceClient();
  const { data } = await db
    .from("google_connections")
    .select("google_email")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function disconnectGoogle(userId: string): Promise<void> {
  const db = createServiceClient();
  await db.from("google_connections").delete().eq("user_id", userId);
}

// ---- Calendar ----

export async function createCalendarEvent(
  accessToken: string,
  params: {
    summary: string;
    description: string;
    deadlineDate: Date;
  }
): Promise<string | null> {
  const dateStr = params.deadlineDate.toISOString().split("T")[0];

  const res = await fetch(CALENDAR_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: params.summary,
      description: params.description,
      start: { date: dateStr },
      end: { date: dateStr },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    }),
  });

  if (!res.ok) {
    console.error("Falha ao criar evento no Calendar:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.id ?? null;
}

// ---- Drive ----

export async function createDriveFolder(
  accessToken: string,
  folderName: string
): Promise<{ id: string; url: string } | null> {
  const res = await fetch(DRIVE_FILES_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });

  if (!res.ok) {
    console.error("Falha ao criar pasta no Drive:", await res.text());
    return null;
  }

  const data = await res.json();
  return {
    id: data.id,
    url: `https://drive.google.com/drive/folders/${data.id}`,
  };
}

export async function shareDriveFolder(
  accessToken: string,
  folderId: string,
  email: string
): Promise<void> {
  const res = await fetch(`${DRIVE_FILES_API}/${folderId}/permissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "writer",
      type: "user",
      emailAddress: email,
    }),
  });

  if (!res.ok) {
    console.error(`Falha ao compartilhar pasta Drive com ${email}:`, await res.text());
  }
}

// ---- Hook chamado ao aceitar proposta ----

interface ProposalAcceptedGoogleParams {
  projectId: string;
  projectTitle: string;
  deadlineDays: number | null;
  clientId: string;
  clientEmail: string;
  freelancerId: string;
  freelancerEmail: string;
}

export async function handleProposalAcceptedGoogle(
  params: ProposalAcceptedGoogleParams
): Promise<void> {
  const {
    projectId,
    projectTitle,
    deadlineDays,
    clientId,
    clientEmail,
    freelancerId,
    freelancerEmail,
  } = params;

  const db = createServiceClient();

  const [clientToken, freelancerToken] = await Promise.all([
    getValidAccessToken(clientId),
    getValidAccessToken(freelancerId),
  ]);

  const hasGoogle = clientToken || freelancerToken;
  if (!hasGoogle) return;

  let clientEventId: string | null = null;
  let freelancerEventId: string | null = null;
  let driveFolderId: string | null = null;
  let driveFolderUrl: string | null = null;

  // Calendar — só cria se tiver prazo definido
  if (deadlineDays) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);

    const eventSummary = `Prazo — ${projectTitle}`;
    const eventDescription = `Projeto contratado via PrestaCerto.\nPrazo: ${deadline.toLocaleDateString("pt-BR")}`;

    if (clientToken) {
      clientEventId = await createCalendarEvent(clientToken, {
        summary: eventSummary,
        description: eventDescription,
        deadlineDate: deadline,
      });
    }

    if (freelancerToken) {
      freelancerEventId = await createCalendarEvent(freelancerToken, {
        summary: eventSummary,
        description: eventDescription,
        deadlineDate: deadline,
      });
    }
  }

  // Drive — usa o token de quem tiver conectado (cliente tem prioridade)
  const driveToken = clientToken ?? freelancerToken;
  if (driveToken) {
    const folder = await createDriveFolder(driveToken, `PrestaCerto — ${projectTitle}`);
    if (folder) {
      driveFolderId = folder.id;
      driveFolderUrl = folder.url;

      // Compartilha com a outra parte
      if (driveToken === clientToken && freelancerEmail) {
        await shareDriveFolder(driveToken, folder.id, freelancerEmail);
      } else if (driveToken === freelancerToken && clientEmail) {
        await shareDriveFolder(driveToken, folder.id, clientEmail);
      }
    }
  }

  if (clientEventId || freelancerEventId || driveFolderId) {
    await db.from("project_google_data").upsert(
      {
        project_id: projectId,
        drive_folder_id: driveFolderId,
        drive_folder_url: driveFolderUrl,
        client_calendar_event_id: clientEventId,
        freelancer_calendar_event_id: freelancerEventId,
      },
      { onConflict: "project_id" }
    );
  }
}
