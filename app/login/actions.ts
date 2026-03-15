"use server";

import { redirect } from "next/navigation";

import {
  clearSession,
  type AuthState,
  signInWithPassword,
} from "../../lib/auth";

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Skriv inn både e-post og passord for å logge inn.",
    };
  }

  const authResult = await signInWithPassword(email, password);

  if ("error" in authResult && authResult.error) {
    return {
      error: authResult.error,
    };
  }

  redirect("/oversikt");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
