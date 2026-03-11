import { IntegrationCard } from "../../../components/integrations/IntegrationCard";
import { Container } from "../../../components/ui/container";
import { mockWorkspace } from "../../../lib/mockData";

const integrations = [
  {
    name: "Gmail",
    logoText: "G",
    logoStyle: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
    status: "Tilkoblet",
    description: "E-post og oppfølging for Salgs-AI.",
    actionLabel: "Administrer",
    compact: true,
  },
  {
    name: "Outlook",
    logoText: "O",
    logoStyle: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    status: "Ikke tilkoblet",
    description: "Kalender og e-post for møter og oppfølging.",
    actionLabel: "Koble til",
    compact: true,
  },
  {
    name: "HubSpot",
    logoText: "H",
    logoStyle: "bg-orange-50 text-orange-700 ring-1 ring-orange-100",
    status: "Tilkoblet",
    description: "CRM-data for leads, pipeline og kundehistorikk.",
    actionLabel: "Administrer",
  },
  {
    name: "Slack",
    logoText: "S",
    logoStyle: "bg-violet-50 text-violet-700 ring-1 ring-violet-100",
    status: "Tilkoblet",
    description: "Varsler og godkjenninger direkte i teamets kanaler.",
    actionLabel: "Administrer",
  },
  {
    name: "Tripletex",
    logoText: "T",
    logoStyle: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    status: "Ikke tilkoblet",
    description: "Økonomidata og kundegrunnlag for Admin-AI.",
    actionLabel: "Koble til",
  },
];

const integrationStats = [
  {
    label: "Tilkoblede integrasjoner",
    value: "3 av 5",
    note: "Gmail, HubSpot og Slack er aktive",
  },
  {
    label: "AI-ansatte med datatilgang",
    value: "3",
    note: "Alle AI-ansatte bruker minst én integrasjon",
  },
  {
    label: "Anbefalte neste steg",
    value: "2",
    note: "Koble Outlook og Tripletex for bredere flyt",
  },
];

export default function IntegrationsPage() {
  const connectedIntegrations = integrations.filter(
    (integration) => integration.status === "Tilkoblet"
  );
  const availableIntegrations = integrations.filter(
    (integration) => integration.status === "Ikke tilkoblet"
  );

  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header">
          <div className="container-header pb-0">
            <p className="page-kicker">Integrasjoner i {mockWorkspace.name}</p>
            <h1 className="page-title">Koble systemer til dine AI-ansatte</h1>
            <p className="page-subtitle max-w-2xl">
              Se hva som er koblet til nå, og hvilke systemer som kan aktiveres videre.
            </p>
          </div>
          <div className="page-header-aside">
            <p className="page-copy">Dekning i arbeidsrommet</p>
            <p className="metric-value mt-1">God</p>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {integrationStats.map((stat) => (
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
            <h2 className="section-title">Tilkoblede systemer</h2>
            <p className="section-copy mt-1">Systemer som allerede brukes av AI-ansatte.</p>
          </div>
        </div>

        <div className="container-content grid gap-6 xl:grid-cols-2">
          {connectedIntegrations.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>
      </Container>

      <Container>
        <div className="container-header">
          <h2 className="section-title">Klar til kobling</h2>
          <p className="section-copy mt-1">Systemer du kan aktivere for bredere arbeidsflyt.</p>
        </div>

        <div className="container-content grid gap-4 xl:grid-cols-2">
          {availableIntegrations.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>
      </Container>
    </div>
  );
}
