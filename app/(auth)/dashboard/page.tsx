import {
  ActivityListItem,
  EmployeeCard,
  StatCard,
} from "../../../components/dashboard/DashboardCards";
import { Container } from "../../../components/ui/container";
import { mockWorkspace } from "../../../lib/mockData";

const stats = [
  {
    label: "Fullførte oppgaver",
    value: "128",
    change: "+18 % siste 30 dager",
  },
  {
    label: "Aktive AI-ansatte",
    value: "3",
    change: "Alle er operative i dag",
  },
  {
    label: "Tilkoblede integrasjoner",
    value: "6",
    change: "CRM, e-post og økonomi er synkronisert",
  },
];

const employees = [
  {
    name: "Salgs-AI",
    description:
      "Kvalifiserer innkommende leads, følger opp potensielle kunder og foreslår neste steg for salgsteamet.",
    status: "Aktiv nå",
    metricLabel: "Behandlede leads i dag",
    metricValue: "24",
  },
  {
    name: "Tilbuds-AI",
    description:
      "Setter sammen utkast til tilbud basert på kundebehov, prisrammer og tidligere leveranser.",
    status: "Kjører 4 oppgaver",
    metricLabel: "Utkast sendt til godkjenning",
    metricValue: "7",
  },
  {
    name: "Admin-AI",
    description:
      "Oppdaterer CRM, organiserer dokumentasjon og sørger for at administrative rutiner blir fulgt opp.",
    status: "Stabil drift",
    metricLabel: "Automatiserte rutiner denne uken",
    metricValue: "31",
  },
];

const activities = [
  {
    title: "Tilbuds-AI opprettet nytt tilbudsutkast",
    description: "Utkast til Fjordbygg AS er klart for gjennomgang i oppgaveflyten.",
    time: "For 12 minutter siden",
  },
  {
    title: "Salgs-AI kvalifiserte ny lead",
    description: "Nordic Drift AS ble merket som høy prioritet etter analyse av behov og budsjett.",
    time: "For 38 minutter siden",
  },
  {
    title: "Admin-AI oppdaterte kundeprofil",
    description: "Kontaktperson og fakturainformasjon for Vestkyst Entreprenør ble synkronisert fra ERP.",
    time: "I dag kl. 09:14",
  },
  {
    title: "Ny integrasjon overvåkes",
    description: "Slack-varsler for oppgaveavvik er aktivert i arbeidsrommet.",
    time: "I går kl. 16:42",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header md:grid-cols-[minmax(0,2fr)_240px]">
          <div className="container-header pb-0">
            <p className="page-kicker">Arbeidsrom</p>
            <h1 className="page-title">
              Velkommen tilbake til {mockWorkspace.name}
            </h1>
            <p className="page-subtitle max-w-2xl">
              Her styrer du AI-ansatte som utfører konkrete oppgaver innen salg,
              tilbud og administrasjon. Dashboardet gir deg rask oversikt over
              drift, kapasitet og hva som krever oppmerksomhet.
            </p>
          </div>
          <div className="page-header-aside grid gap-4">
            <div>
              <p className="page-copy">Status i dag</p>
              <p className="metric-value mt-1">Stabil drift</p>
            </div>
            <div>
              <p className="page-copy">Neste anbefalte steg</p>
              <p className="metric-value mt-1">Godkjenn 2 tilbud</p>
            </div>
          </div>
        </div>
      </Container>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Container key={stat.label} className="shadow-none">
            <StatCard {...stat} />
          </Container>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
        <Container>
          <div>
            <div className="container-header sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">AI-ansatte</h2>
                <p className="section-copy mt-1">
                  Følg status, kapasitet og leveranser fra dine spesialiserte AI-ansatte.
                </p>
              </div>
              <button className="button-secondary px-4 py-2">
                Se alle AI-ansatte
              </button>
            </div>

            <div className="container-content grid gap-4 lg:grid-cols-3">
              {employees.map((employee) => (
                <EmployeeCard key={employee.name} {...employee} />
              ))}
            </div>
          </div>
        </Container>

        <Container>
          <div>
            <div className="container-header">
              <h2 className="section-title">Nylig aktivitet</h2>
              <p className="section-copy mt-1">
                Hendelser fra arbeidsrommet som påvirker oppgaver, kunder og integrasjoner.
              </p>
            </div>

            <div className="container-content space-y-5">
              {activities.map((activity) => (
                <ActivityListItem key={`${activity.title}-${activity.time}`} {...activity} />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
