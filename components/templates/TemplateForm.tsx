"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { TemplateType } from "../../lib/templates";

const templateTypes: TemplateType[] = ["Tilbud", "E-post", "Rapport"];

interface TemplateFormProps {
  title: string;
  description: string;
  submitLabel: string;
  cancelHref: string;
  initialValues: {
    name: string;
    type: TemplateType;
    body: string;
  };
  onSubmit: (values: {
    name: string;
    type: TemplateType;
    body: string;
  }) => void;
  statusMessage?: string;
}

export function TemplateForm({
  title,
  description,
  submitLabel,
  cancelHref,
  initialValues,
  onSubmit,
  statusMessage,
}: TemplateFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [type, setType] = useState<TemplateType>(initialValues.type);
  const [body, setBody] = useState(initialValues.body);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name, type, body });
  }

  return (
    <article className="py-2">
      <div className="container-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-copy mt-1">{description}</p>
      </div>

      <form className="container-content space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="field-label">Navn på malen</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="field-label">Type</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as TemplateType)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white"
          >
            {templateTypes.map((templateType) => (
              <option key={templateType} value={templateType}>
                {templateType}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="field-label">Maltekst</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={14}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
          />
        </label>

        <div className="container-actions pt-2 sm:flex-row">
          <button
            type="submit"
            className="button-primary"
          >
            {submitLabel}
          </button>
          <Link
            href={cancelHref}
            className="button-secondary font-semibold"
          >
            Avbryt
          </Link>
        </div>
      </form>

      {statusMessage ? (
        <div className="container-actions pt-5">
          <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-800 ring-1 ring-emerald-100">
            {statusMessage}
          </div>
        </div>
      ) : null}
    </article>
  );
}
