import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthenticatedAppSession } from "./auth-types";
import { ensureWorkspaceForUserEmail, getWorkspaceSessionByEmail } from "./db";
import { createSupabaseClient, isSupabaseConfigured } from "./supabase";

const ACCESS_TOKEN_COOKIE = "sb-access-token";
const REFRESH_TOKEN_COOKIE = "sb-refresh-token";

export type AuthState = {
  error?: string;
};

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const supabase = createSupabaseClient();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (supabase && accessToken && refreshToken) {
    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (setSessionError) {
      console.error("[auth] Failed to hydrate Supabase session during logout", setSessionError);
    } else {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("[auth] Supabase signOut failed", signOutError);
      }
    }
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return {
      error:
        "Supabase er ikke konfigurert. Legg inn NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY i .env.local.",
    } satisfies AuthState;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user.email) {
    console.error("[auth] signInWithPassword failed", {
      email,
      error: error?.message ?? "Missing session or user email",
    });
    return {
      error: error?.message ?? "Kunne ikke logge inn med Supabase Auth.",
    } satisfies AuthState;
  }

  await setAuthCookies(data.session.access_token, data.session.refresh_token);
  await ensureWorkspaceForUserEmail(
    data.user.email,
    data.user.user_metadata?.full_name as string | undefined,
  );

  return {
    session: await getWorkspaceSessionByEmail(
      data.user.email,
      (data.user.user_metadata?.full_name as string | undefined) ?? data.user.email,
    ),
  };
}

export async function getSession(): Promise<AuthenticatedAppSession | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const supabase = createSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session?.user.email) {
    console.error("[auth] getSession failed", {
      error: error?.message ?? "Missing Supabase session or user email",
    });
    return null;
  }

  return getWorkspaceSessionByEmail(
    data.session.user.email,
    (data.session.user.user_metadata?.full_name as string | undefined) ?? data.session.user.email,
  );
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
