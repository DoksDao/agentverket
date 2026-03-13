import type { TemplateType } from "./templates";

export interface TaskInput {
  id: string;
  label: string;
  defaultValue: string;
  kind?: "input" | "textarea";
}

export interface EmployeeTask {
  id: string;
  name: string;
  templateType: TemplateType;
  description: string;
  resultLabel: string;
  resultSummary: string;
  inputs: TaskInput[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  description: string;
  tasks: EmployeeTask[];
}

export const employees: Employee[] = [
  {
    id: "sales",
    name: "Salgs-AI",
    role: "Digital salgsmedarbeider",
    description: "Jobber med leadskvalifisering og oppfølging av potensielle kunder.",
    tasks: [
      {
        id: "lead-analysis",
        name: "Analyser lead",
        templateType: "Rapport",
        description:
          "Vurder om en ny potensiell kunde passer målgruppen, og foreslå anbefalt oppfølging.",
        resultLabel: "Lead-analyse klar",
        resultSummary:
          "Salgs-AI har analysert leadden, prioritert den og foreslått neste steg for salgsteamet.",
        inputs: [
          { id: "company", label: "Firmanavn", defaultValue: "Nordic Drift AS" },
          { id: "industry", label: "Bransje", defaultValue: "Eiendomsdrift" },
          {
            id: "need",
            label: "Behov",
            defaultValue:
              "Ønsker bedre håndtering av innkommende forespørsler og tydeligere pipeline.",
            kind: "textarea",
          },
          {
            id: "budget",
            label: "Budsjettområde",
            defaultValue: "150 000 til 300 000 NOK",
          },
        ],
      },
      {
        id: "follow-up-email",
        name: "Skriv oppfølgingsmail",
        templateType: "E-post",
        description:
          "Lag et førsteutkast til oppfølgingsmail basert på tidligere dialog og ønsket neste steg.",
        resultLabel: "Oppfølgingsmail klar",
        resultSummary:
          "Salgs-AI har skrevet en målrettet oppfølgingsmail med tydelig verdi og forslag til videre fremdrift.",
        inputs: [
          {
            id: "recipient",
            label: "Mottaker",
            defaultValue: "line.hansen@nordicdrift.no",
          },
          { id: "contact", label: "Kontaktperson", defaultValue: "Line Hansen" },
          {
            id: "context",
            label: "Bakgrunn",
            defaultValue:
              "Kontaktpersonen deltok på demo og ønsker forslag til neste steg denne uken.",
            kind: "textarea",
          },
        ],
      },
    ],
  },
  {
    id: "offers",
    name: "Tilbuds-AI",
    role: "Tilbudskoordinator",
    description: "Setter sammen tilbudsutkast basert på leveranse, pris og valgt mal.",
    tasks: [
      {
        id: "create-offer",
        name: "Lag tilbud",
        templateType: "Tilbud",
        description:
          "Opprett et nytt tilbudsutkast basert på kundeinformasjon, leveransebehov og prisramme.",
        resultLabel: "Tilbud klart for gjennomgang",
        resultSummary:
          "Tilbuds-AI har generert et førsteutkast med anbefalt struktur, leveranseomfang og prisoppsett.",
        inputs: [
          { id: "customer", label: "Kunde", defaultValue: "Fjordbygg AS" },
          { id: "value", label: "Estimert verdi", defaultValue: "250 000 NOK" },
          {
            id: "delivery",
            label: "Leveransebeskrivelse",
            defaultValue:
              "Utarbeid tilbud på implementering av AI-støttet leadshåndtering, onboarding og opplæring for salgsteam på 8 personer.",
            kind: "textarea",
          },
          { id: "priority", label: "Prioritet", defaultValue: "Høy" },
        ],
      },
    ],
  },
  {
    id: "admin",
    name: "Admin-AI",
    role: "Administrativ operatør",
    description: "Oppsummerer møter og bygger rapporter for intern oppfølging.",
    tasks: [
      {
        id: "meeting-summary",
        name: "Oppsummer møte",
        templateType: "Rapport",
        description:
          "Gjør møtenotater om til en strukturert oppsummering med beslutninger og neste steg.",
        resultLabel: "Møteoppsummering klar",
        resultSummary:
          "Admin-AI har laget en strukturert oppsummering med beslutninger, ansvar og anbefalt oppfølging.",
        inputs: [
          {
            id: "participants",
            label: "Deltakere",
            defaultValue: "Ingrid Nilsen, Ola Berg, Kundeansvarlig",
          },
          {
            id: "project",
            label: "Prosjekt eller kunde",
            defaultValue: "Nordlys Vekst / Fjordbygg AS",
          },
          {
            id: "notes",
            label: "Møtenotater",
            defaultValue:
              "Diskuterte utrulling i to faser, behov for opplæring og forslag til oppstart i april.",
            kind: "textarea",
          },
        ],
      },
      {
        id: "weekly-report",
        name: "Lag ukesrapport",
        templateType: "Rapport",
        description:
          "Sett sammen en ukentlig rapport med status, avvik og anbefalte tiltak for teamet.",
        resultLabel: "Ukesrapport klar",
        resultSummary:
          "Admin-AI har sammenstilt ukesrapporten med nøkkelpunkter, avvik og anbefalte tiltak.",
        inputs: [
          { id: "week", label: "Uke", defaultValue: "Uke 11" },
          {
            id: "status",
            label: "Statusgrunnlag",
            defaultValue:
              "Tre nye tilbud sendt, to leads kvalifisert og én integrasjon aktivert.",
            kind: "textarea",
          },
          {
            id: "owner",
            label: "Ansvarlig team",
            defaultValue: "Salgs- og driftsteam",
          },
        ],
      },
    ],
  },
];

export function findEmployee(employeeId: string) {
  return employees.find((employee) => employee.id === employeeId) ?? null;
}

export function findEmployeeTask(employeeId: string, taskId: string) {
  const employee = findEmployee(employeeId);

  if (!employee) {
    return null;
  }

  const task = employee.tasks.find((candidate) => candidate.id === taskId) ?? null;

  if (!task) {
    return null;
  }

  return {
    employee,
    task,
  };
}
