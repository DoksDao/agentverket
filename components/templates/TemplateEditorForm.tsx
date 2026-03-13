import Link from "next/link";

import type { TemplateType } from "../../lib/templates";

const templateTypes: TemplateType[] = ["Tilbud", "E-post", "Rapport"];

interface TemplateEditorFormProps {
  title: string;
  description: string;
  submitLabel: string;
  cancelHref: string;
  initialValues: {
    name: string;
    type: TemplateType;
    body: string;
  };
  formAction: (formData: FormData) => void | Promise<void>;
  templateId?: string;
}

export function TemplateEditorForm({
  title,
  description,
  submitLabel,
  cancelHref,
  initialValues,
  formAction,
  templateId,
}: TemplateEditorFormProps) {
  return (
    <article className="py-2">
      <div className="container-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-copy mt-1">{description}</p>
      </div>

      <form className="container-content space-y-5" action={formAction}>
        {templateId ? <input type="hidden" name="templateId" value={templateId} /> : null}

        <label className="block space-y-2">
          <span className="field-label">Navn på malen</span>
          <input
            name="name"
            defaultValue={initialValues.name}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="field-label">Type</span>
          <select
            name="type"
            defaultValue={initialValues.type}
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
            name="body"
            defaultValue={initialValues.body}
            rows={14}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
            required
          />
        </label>

        <div className="container-actions pt-2 sm:flex-row">
          <button type="submit" className="button-primary">
            {submitLabel}
          </button>
          <Link href={cancelHref} className="button-secondary font-semibold">
            Avbryt
          </Link>
        </div>
      </form>
    </article>
  );
}
