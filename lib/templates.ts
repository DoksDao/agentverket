"use client";

export type TemplateType = "Tilbud" | "E-post" | "Rapport";

export interface StoredTemplate {
  id: string;
  name: string;
  type: TemplateType;
  body: string;
  updatedAt: string;
}

const STORAGE_KEY = "agentverket.templates";
const STORAGE_EVENT = "agentverket-templates-updated";

const defaultTemplates: StoredTemplate[] = [
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

function canUseStorage() {
  return typeof window !== "undefined";
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `template-${Date.now()}`;
}

function dispatchTemplatesUpdated() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function formatTemplateDate(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function readTemplates(): StoredTemplate[] {
  if (!canUseStorage()) {
    return defaultTemplates;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTemplates));
    return defaultTemplates;
  }

  try {
    const parsed = JSON.parse(raw) as StoredTemplate[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

export function writeTemplates(templates: StoredTemplate[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  dispatchTemplatesUpdated();
}

export function createTemplate(input: Omit<StoredTemplate, "id" | "updatedAt">) {
  const templates = readTemplates();
  const nextTemplate: StoredTemplate = {
    ...input,
    id: createId(),
    updatedAt: new Date().toISOString(),
  };

  writeTemplates([nextTemplate, ...templates]);
  return nextTemplate;
}

export function updateTemplate(
  id: string,
  input: Omit<StoredTemplate, "id" | "updatedAt">
) {
  const templates = readTemplates();
  const updatedTemplates = templates.map((template) =>
    template.id === id
      ? { ...template, ...input, updatedAt: new Date().toISOString() }
      : template
  );

  writeTemplates(updatedTemplates);
  return updatedTemplates.find((template) => template.id === id) ?? null;
}

export function getTemplateById(id: string) {
  return readTemplates().find((template) => template.id === id) ?? null;
}

export function subscribeToTemplateChanges(callback: () => void) {
  if (!canUseStorage()) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}
