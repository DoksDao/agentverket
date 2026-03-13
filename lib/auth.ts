import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthenticatedAppSession } from "./auth-types";
import {
  authenticateUser,
  createDatabaseSession,
  deleteDatabaseSession,
  findSessionByToken,
  getDemoCredentials as getDatabaseDemoCredentials,
} from "./db";

const SESSION_COOKIE_NAME = "agentverket_session";

export type AuthState = {
  error?: string;
};

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  const session = createDatabaseSession(userId);

  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: session.expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    deleteDatabaseSession(token);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<AuthenticatedAppSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return findSessionByToken(token);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export function validateCredentials(email: string, password: string) {
  return authenticateUser(email, password);
}

export function getDemoCredentials() {
  return getDatabaseDemoCredentials();
}
