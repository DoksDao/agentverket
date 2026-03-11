import { ActivityRow } from "../../../components/activity/ActivityRow";
import { Container } from "../../../components/ui/container";
import { mockWorkspace } from "../../../lib/mockData";

const activityFilters = ["Alle", "Fullført", "Feilet"];

const activityItems = [
  {
    taskName: "Lag tilbud",
    aiEmployee: "Tilbuds-AI",
    time: "I dag kl. 10:42",
    status: "Fullført",
    details: "Tilbudsutkast for Fjordbygg AS ble generert og sendt til gjennomgang.",
  },
  {
    taskName: "Analyser lead",
    aiEmployee: "Salgs-AI",
    time: "I dag kl. 09:18",
    status: "Fullført",
    details: "Lead fra Nordic Drift AS ble vurdert som høy prioritet med anbefalt oppfølging innen 24 timer.",
  },
  {
    taskName: "Oppsummer møte",
    aiEmployee: "Admin-AI",
    time: "I går kl. 15:07",
    status: "Fullført",
    details: "Møtereferat fra ukentlig salgsmøte ble oppsummert og distribuert til teamet.",
  },
  {
    taskName: "Lag tilbud",
    aiEmployee: "Tilbuds-AI",
    time: "I går kl. 13:26",
    status: "Feilet",
    details: "Prisgrunnlag manglet for én tjenestelinje, og oppgaven ble stoppet før utsending.",
  },
  {
    taskName: "Analyser lead",
    aiEmployee: "Salgs-AI",
    time: "Mandag kl. 11:54",
    status: "Fullført",
    details: "Lead fra Vestkyst Entreprenør ble kvalifisert og lagt inn med anbefalt neste steg i CRM.",
  },
];

const activityStats = [
  {
    label: "Aktiviteter siste 7 dager",
    value: "42",
    note: "8 flere enn forrige uke",
  },
  {
    label: "Fullføringsgrad",
    value: "93 %",
    note: "Stabil gjennomføring på tvers av AI-ansatte",
  },
  {
    label: "Feilede oppgaver",
    value: "3",
    note: "Alle krever kun mindre datakorrigering",
  },
];

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header">
          <div className="container-header pb-0">
            <p className="page-kicker">Aktivitet i {mockWorkspace.name}</p>
            <h1 className="page-title">Oversikt over tidligere AI-aktiviteter</h1>
            <p className="page-subtitle max-w-2xl">
              Følg hvilke oppgaver som er kjørt, hvilken AI-ansatt som ble brukt
              og hva som krever oppfølging. Siden er laget for rask skanning og
              kontroll i en travel arbeidshverdag.
            </p>
          </div>
          <div className="page-header-aside">
            <p className="page-copy">Siste aktivitet</p>
            <p className="metric-value mt-1">For 18 minutter siden</p>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid gap-6 md:grid-cols-3">
          {activityStats.map((stat) => (
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
        <div className="container-header lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="section-title">Aktivitetslogg</h2>
            <p className="section-copy mt-1">
              Filtrer og gjennomgå oppgaver som er kjørt av AI-ansatte i arbeidsrommet.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {activityFilters.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  index === 0
                    ? "bg-[var(--brand)] text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="meta-label container-content hidden grid-cols-[1.2fr_1fr_0.9fr_0.7fr_0.7fr] gap-4 px-4 lg:grid">
          <span>Oppgave</span>
          <span>AI-ansatt</span>
          <span>Tidspunkt</span>
          <span>Status</span>
          <span className="text-right">Detaljer</span>
        </div>

        <div className="container-content space-y-3">
          {activityItems.map((activity) => (
            <ActivityRow key={`${activity.taskName}-${activity.time}`} {...activity} />
          ))}
        </div>
      </Container>
    </div>
  );
}
