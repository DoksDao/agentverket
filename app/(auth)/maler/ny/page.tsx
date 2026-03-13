import { TemplateEditorForm } from "../../../../components/templates/TemplateEditorForm";
import { Container } from "../../../../components/ui/container";
import { requireSession } from "../../../../lib/auth";
import { createTemplateAction } from "../actions";

const initialTemplateText = `Hei {{kunde}},

Takk for forespørselen. Under finner du et førsteutkast som kan brukes av AI-ansatte i videre oppfølging.

Bakgrunn:
- {{bakgrunn}}

Forslag:
- {{forslag}}

Neste steg:
- {{neste_steg}}
`;

export default async function NewTemplatePage() {
  const session = await requireSession();

  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header">
          <div className="container-header pb-0">
            <p className="page-kicker">Ny mal i {session.workspace.name}</p>
            <h1 className="page-title">Opprett en ny mal for AI-ansatte</h1>
            <p className="page-subtitle max-w-2xl">
              Definer navn, type og maltekst for nye leveranser. Malen lagres i
              databasen og blir tilgjengelig i oppgaver med en gang.
            </p>
          </div>
          <div className="page-header-aside">
            <p className="page-copy">Lagringsmodus</p>
            <p className="metric-value mt-1">Database</p>
          </div>
        </div>
      </Container>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Container>
          <TemplateEditorForm
            title="Maloppsett"
            description="Fyll inn grunninformasjon og skriv teksten som AI-ansatte skal bruke som utgangspunkt."
            submitLabel="Lagre"
            cancelHref="/maler"
            formAction={createTemplateAction}
            initialValues={{
              name: "Ny kundemal",
              type: "Tilbud",
              body: initialTemplateText,
            }}
          />
        </Container>

        <div className="space-y-6">
          <Container>
            <div className="container-header">
              <h2 className="section-title">Forhåndsvisning</h2>
              <p className="section-copy">
                Denne malen kan brukes av AI-ansatte som grunnlag når de skriver
                utkast og strukturerte leveranser.
              </p>
            </div>
            <div className="container-content">
              <p className="meta-label">Eksempel på bruk</p>
              <p className="body-text mt-3">
                Tilbuds-AI kan fylle inn felter som <span className="font-medium text-slate-950">{"{{kunde}}"}</span>,
                <span className="font-medium text-slate-950"> {"{{forslag}}"}</span> og
                <span className="font-medium text-slate-950"> {"{{neste_steg}}"}</span> automatisk.
              </p>
            </div>
          </Container>

          <Container>
            <div className="container-header">
              <h2 className="section-title">Hva skjer ved lagring</h2>
              <p className="section-copy">
                Når du lagrer, blir malen tilgjengelig på oversiktssiden og i oppgaven
                <span className="font-medium text-[var(--brand)]"> Lag tilbud</span>.
              </p>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
