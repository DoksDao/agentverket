"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "../../../../components/ui/container";
import { TemplateForm } from "../../../../components/templates/TemplateForm";
import { mockWorkspace } from "../../../../lib/mockData";
import {
  getTemplateById,
  StoredTemplate,
  subscribeToTemplateChanges,
  updateTemplate,
} from "../../../../lib/templates";

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [template, setTemplate] = useState<StoredTemplate | null | undefined>(undefined);

  useEffect(() => {
    function loadTemplate() {
      setTemplate(getTemplateById(params.id));
    }

    loadTemplate();

    return subscribeToTemplateChanges(loadTemplate);
  }, [params.id]);

  if (template === undefined) {
    return (
      <Container>
        <p className="section-copy">Laster mal...</p>
      </Container>
    );
  }

  if (template === null) {
    return (
      <Container className="border-dashed bg-slate-50 text-center">
        <h1 className="page-title">Fant ikke malen</h1>
        <p className="section-copy mt-2">
          Malen finnes ikke i nettleserlagringen. Gå tilbake til oversikten og opprett en ny ved behov.
        </p>
      </Container>
    );
  }

  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header">
          <div className="container-header pb-0">
            <p className="page-kicker">
              Rediger mal i {mockWorkspace.name}
            </p>
            <h1 className="page-title">
              Oppdater mal for AI-ansatte
            </h1>
            <p className="page-subtitle max-w-2xl">
              Endringer lagres i nettleseren og slår gjennom direkte i oppgaver som bruker malen.
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
          <TemplateForm
            title="Rediger mal"
            description="Juster navn, type eller innhold og lagre for å oppdatere malen overalt i produktet."
            submitLabel="Lagre endringer"
            cancelHref="/maler"
            initialValues={{
              name: template.name,
              type: template.type,
              body: template.body,
            }}
            onSubmit={(values) => {
              updateTemplate(template.id, values);
              router.push("/maler");
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
            <p className="meta-label">
              Aktiv type
            </p>
            <p className="body-text mt-2">{template.type}</p>
          </div>
        </Container>
      </div>
    </div>
  );
}
