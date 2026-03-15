import { notFound } from "next/navigation";

import { TemplateEditorForm } from "../../../../components/templates/TemplateEditorForm";
import { Container } from "../../../../components/ui/container";
import { requireSession } from "../../../../lib/auth";
import { getTemplateById } from "../../../../lib/db";
import { updateTemplateAction } from "../actions";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const template = await getTemplateById(session.workspace.id, id);

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header">
          <div className="container-header pb-0">
            <p className="page-kicker">Rediger mal i {session.workspace.name}</p>
            <h1 className="page-title">Oppdater mal for AI-ansatte</h1>
            <p className="page-subtitle max-w-2xl">
              Endringer lagres i databasen og slår gjennom direkte i oppgaver som bruker malen.
            </p>
          </div>
          <div className="page-header-aside">
            <p className="page-copy">Aktiv type</p>
            <p className="metric-value mt-1">{template.type}</p>
          </div>
        </div>
      </Container>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Container>
          <TemplateEditorForm
            title="Rediger mal"
            description="Juster navn, type eller innhold og lagre for å oppdatere malen overalt i produktet."
            submitLabel="Lagre endringer"
            cancelHref="/maler"
            formAction={updateTemplateAction}
            templateId={template.id}
            initialValues={{
              name: template.name,
              type: template.type,
              body: template.body,
            }}
          />
        </Container>

        <Container>
          <div className="container-header">
            <h2 className="section-title">Bruksområde</h2>
            <p className="section-copy">
              Denne malen kan brukes av AI-ansatte i oppgaver som matcher valgt type.
            </p>
          </div>
          <div className="container-content">
            <p className="meta-label">Aktiv type</p>
            <p className="body-text mt-2">{template.type}</p>
          </div>
        </Container>
      </div>
    </div>
  );
}
