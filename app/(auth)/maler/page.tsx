import Link from "next/link";

import { Container } from "../../../components/ui/container";
import { requireSession } from "../../../lib/auth";
import { listTemplatesByWorkspace } from "../../../lib/db";

export default async function TemplatesPage() {
  const session = await requireSession();
  const templates = listTemplatesByWorkspace(session.workspace.id);

  return (
    <div className="space-y-6">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h1 className="page-title">Maler</h1>
          <div className="flex items-start md:justify-end">
            <Link href="/maler/ny" className="button-primary">
              Ny mal
            </Link>
          </div>
        </div>
      </Container>

      <Container>
        {templates.length === 0 ? (
          <div className="container-content py-8 text-center">
            <p className="section-copy">Ingen maler lagret</p>
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
                    <h3 className="section-title">{template.name}</h3>
                    <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {template.type}
                    </span>
                  </div>
                </div>

                <Link href={`/maler/${template.id}`} className="button-secondary">
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
