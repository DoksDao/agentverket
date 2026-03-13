"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import type { AuthState } from "../../lib/auth";
import { loginAction } from "../../app/login/actions";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="button-primary w-full rounded-xl px-4 py-3"
      disabled={pending}
    >
      {pending ? "Logger inn..." : "Logg inn"}
    </button>
  );
}

export function LoginForm({
  defaultEmail,
  defaultPassword,
}: {
  defaultEmail: string;
  defaultPassword: string;
}) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="field-label">
          E-post
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(27,23,255,0.12)]"
          placeholder="bruker@eksempel.no"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="field-label">
          Passord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue={defaultPassword}
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(27,23,255,0.12)]"
          required
        />
      </div>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
