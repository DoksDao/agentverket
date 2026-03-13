"use server";

import { redirect } from "next/navigation";

import {
  clearSession,
  createSession,
  type AuthState,
  validateCredentials,
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

  const authResult = validateCredentials(email, password);

  if (!authResult) {
    return {
      error: "Ugyldig e-post eller passord. Prøv demo-brukeren som er oppgitt under skjemaet.",
    };
  }

  await createSession(authResult.user.id);
  redirect("/oversikt");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
