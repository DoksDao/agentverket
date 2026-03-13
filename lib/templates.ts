export type TemplateType = "Tilbud" | "E-post" | "Rapport";

export interface StoredTemplate {
  id: string;
  name: string;
  type: TemplateType;
  body: string;
  updatedAt: string;
}

export const defaultTemplates: Array<Omit<StoredTemplate, "id"> & { id: string }> = [
  {
    id: "standard-tilbud",
    name: "Standard tilbud",
    type: "Tilbud",
    body: `Hei {{kunde}},

Takk for forespørselen. Under finner du et tilbudsutkast med anbefalt leveranse, omfang og neste steg.

Leveranse:
- {{leveranse}}

Pris:
- {{pris}}

Neste steg:
- {{neste_steg}}
`,
    updatedAt: "2026-03-11T09:12:00.000Z",
  },
  {
    id: "oppfolgingsmail",
    name: "Oppfølgingsmail",
    type: "E-post",
    body: `Hei {{kunde}},

Takk for praten. Jeg følger opp med en kort oppsummering og forslag til videre fremdrift.

Oppsummering:
- {{oppsummering}}

Forslag til neste steg:
- {{neste_steg}}
`,
    updatedAt: "2026-03-10T14:36:00.000Z",
  },
  {
    id: "ukentlig-rapport",
    name: "Ukentlig rapport",
    type: "Rapport",
    body: `Ukentlig rapport for {{uke}}:

Status:
- {{status}}

Viktige hendelser:
- {{hendelser}}

Anbefalinger:
- {{anbefalinger}}
`,
    updatedAt: "2026-03-10T08:05:00.000Z",
  },
];

export function formatTemplateDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}
