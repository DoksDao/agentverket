import { redirect } from "next/navigation";

import { LoginForm } from "../../components/auth/LoginForm";
import { getDemoCredentials, getSession } from "../../lib/auth";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/oversikt");
  }

  const demoCredentials = getDemoCredentials();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(27,23,255,0.09),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(27,23,255,0.05),transparent_30%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_36px_80px_-48px_rgba(15,23,42,0.24)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-slate-200 bg-[#0f172a] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-6">
            <div className="brand-badge inline-flex rounded-full px-3 py-1 text-xs font-semibold">
              Agentverket
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight">
                Operativ oversikt for AI-ansatte i arbeid
              </h1>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                Logg inn for å følge oppgaver, integrasjoner og aktivitet i arbeidsrommet ditt.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                I dag
              </p>
              <p className="mt-3 text-2xl font-semibold">3 AI-ansatte operative</p>
              <p className="mt-2 text-sm text-slate-300">
                Leads, tilbud og administrative oppgaver håndteres fortløpende.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto flex max-w-md flex-col justify-center">
            <div className="container-header border-b-0 px-0 pb-0">
              <p className="page-kicker">Innlogging</p>
              <h2 className="page-title">Logg inn på Agentverket</h2>
              <p className="page-subtitle">
                Bruk demo-brukeren under for å åpne arbeidsrommet og gå videre til oversikten.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.22)]">
              <LoginForm
                defaultEmail={demoCredentials.email}
                defaultPassword={demoCredentials.password}
              />

              <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                <p className="meta-label">Demo-bruker</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {demoCredentials.email}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Passord: {demoCredentials.password}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
