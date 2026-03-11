import { AIEmployeeCard } from "../../../components/ai-employees/AIEmployeeCard";
import { Container } from "../../../components/ui/container";
import { mockWorkspace } from "../../../lib/mockData";

const aiEmployees = [
  {
    name: "Salgs-AI",
    role: "Digital salgsmedarbeider",
    description:
      "Følger opp nye henvendelser, kvalifiserer potensielle kunder og foreslår neste salgsaktivitet.",
    tasks: [
      "Kvalifisere leads fra nettside og skjema",
      "Skrive førsteutkast til oppfølgingsmeldinger",
      "Prioritere muligheter basert på behov og budsjett",
    ],
  },
  {
    name: "Tilbuds-AI",
    role: "Tilbudskoordinator",
    description:
      "Bygger tilbudsutkast raskt og konsistent med utgangspunkt i kundebehov, prislister og tidligere leveranser.",
    tasks: [
      "Sammenstille tilbud basert på kundeforespørsler",
      "Gjenbruke relevante formuleringer fra tidligere tilbud",
      "Forberede utkast til intern godkjenning",
    ],
  },
  {
    name: "Admin-AI",
    role: "Administrativ operatør",
    description:
      "Holder data oppdatert, organiserer dokumentasjon og automatiserer rutiner som ellers tar tid i hverdagen.",
    tasks: [
      "Oppdatere kundeinformasjon i systemene",
      "Sortere og oppsummere innkommende dokumentasjon",
      "Følge opp faste administrative arbeidsflyter",
    ],
  },
];

export default function AIEmployeesPage() {
  return (
    <div className="space-y-6">
      <Container>
        <div className="page-header md:grid-cols-[minmax(0,2fr)_180px]">
          <div className="container-header pb-0">
            <p className="page-kicker">AI-ansatte i {mockWorkspace.name}</p>
            <h1 className="page-title">AI-ansatte for konkrete arbeidsoppgaver</h1>
            <p className="page-subtitle max-w-2xl">
              Her finner du spesialiserte AI-ansatte som jobber målrettet med
              salg, tilbud og administrasjon. Velg den ansatte du vil bruke, og
              sett i gang oppgaver direkte fra arbeidsrommet.
            </p>
          </div>
          <div className="page-header-aside">
            <p className="page-copy">Tilgjengelige AI-ansatte</p>
            <p className="metric-value mt-1">3</p>
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid gap-6 xl:grid-cols-3">
          {aiEmployees.map((employee) => (
            <AIEmployeeCard key={employee.name} {...employee} />
          ))}
        </div>
      </Container>
    </div>
  );
}
