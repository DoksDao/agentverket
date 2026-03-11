"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mockWorkspace } from "../../../lib/mockData";
import { Container } from "../../../components/ui/container";
import {
  formatTemplateDate,
  readTemplates,
  StoredTemplate,
  subscribeToTemplateChanges,
} from "../../../lib/templates";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<StoredTemplate[]>([]);

  useEffect(() => {
    function syncTemplates() {
      setTemplates(readTemplates());
    }

    syncTemplates();
    return subscribeToTemplateChanges(syncTemplates);
  }, []);

  const templateStats = useMemo(() => {
    const activeCount = templates.length;
    const offerTemplate = templates.find((template) => template.type === "Tilbud");
    const latestTemplate = [...templates].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    )[0];

    return [
      {
        label: "Aktive maler",
        value: String(activeCount),
        note:
          activeCount > 0
            ? "Lagrede maler er tilgjengelige for AI-ansatte"
            : "Ingen maler er lagret ennå",
      },
      {
        label: "Tilbudsmaler",
        value: String(templates.filter((template) => template.type === "Tilbud").length),
        note: offerTemplate
          ? `${offerTemplate.name} kan brukes i oppgaver`
          : "Ingen tilbudsmaler tilgjengelig",
      },
      {
        label: "Sist oppdatert",
        value: latestTemplate ? formatTemplateDate(latestTemplate.updatedAt) : "Ingen data",
        note: latestTemplate
          ? `${latestTemplate.name} er sist endret`
          : "Opprett en mal for å komme i gang",
      },
    ];
  }, [templates]);

  return (
    <div className="space-y-6">
      <Container>
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_auto] md:items-end">
          <div className="container-header pb-0">
            <p className="page-kicker">Maler i {mockWorkspace.name}</p>
            <h1 className="page-title">Administrer maler for AI-ansatte</h1>
            <p className="page-subtitle max-w-2xl">
              Her administrerer du maler som brukes av AI-ansatte i tilbud,
              oppfølging og rapportering. Endringer lagres i nettleseren og blir
              tilgjengelige på tvers av oppgaver og refresh.
            </p>
          </div>
          <div className="flex items-start md:justify-end">
            <Link
              href="/maler/ny"
              className="button-primary"
            >
              Ny mal
            </Link>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {templateStats.map((stat) => (
            <article
              key={stat.label}
              className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_-24px_rgba(15,23,42,0.18)]"
            >
              <p className="meta-label">{stat.label}</p>
              <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{stat.note}</p>
            </article>
          ))}
        </div>
      </Container>

      <Container>
        <div className="container-header sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Dine maler</h2>
            <p className="section-copy mt-1">
              Velg en mal for å justere innhold, struktur og bruk for AI-ansatte.
            </p>
          </div>
        </div>

        {templates.length === 0 ? (
          <div className="container-content py-8 text-center">
            <h3 className="section-title">Ingen maler lagret</h3>
            <p className="section-copy mt-2">
              Opprett en ny mal for å gi AI-ansatte struktur for tilbud, e-post eller rapporter.
            </p>
            <Link
              href="/maler/ny"
              className="button-primary mt-5"
            >
              Opprett første mal
            </Link>
          </div>
        ) : (
          <div className="container-content space-y-4">
            {templates.map((template) => (
              <article
                key={template.id}
                className="flex flex-col gap-5 border-b border-slate-200 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="section-title">
                      {template.name}
                    </h3>
                    <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {template.type}
                    </span>
                  </div>
                  <p className="section-copy mt-3 line-clamp-3 whitespace-pre-wrap">
                    {template.body}
                  </p>
                  <p className="page-copy mt-3">
                    Sist oppdatert: {formatTemplateDate(template.updatedAt)}
                  </p>
                </div>

                <Link
                  href={`/maler/${template.id}`}
                  className="button-secondary"
                >
                  Rediger
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
