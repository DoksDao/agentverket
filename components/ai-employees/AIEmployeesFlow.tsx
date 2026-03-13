"use client";

import { useMemo, useState } from "react";

import type { StoredTemplate } from "../../lib/templates";
import { AIEmployeeCard } from "./AIEmployeeCard";

const aiEmployees = [
  {
    id: "sales" as const,
    name: "Salgs-AI",
    description:
      "Følger opp nye henvendelser, kvalifiserer potensielle kunder og foreslår neste salgsaktivitet.",
  },
  {
    id: "offers" as const,
    name: "Tilbuds-AI",
    description:
      "Bygger tilbudsutkast raskt og konsistent med utgangspunkt i kundebehov, prislister og tidligere leveranser.",
  },
  {
    id: "admin" as const,
    name: "Admin-AI",
    description:
      "Holder data oppdatert, organiserer dokumentasjon og automatiserer rutiner som ellers tar tid i hverdagen.",
  },
];

function extractVariables(templateBody: string) {
  const matches = templateBody.matchAll(/{{\s*([^}]+?)\s*}}/g);
  const seen = new Set<string>();
  const variables: string[] = [];

  for (const match of matches) {
    const variableName = match[1]?.trim();

    if (variableName && !seen.has(variableName)) {
      seen.add(variableName);
      variables.push(variableName);
    }
  }

  return variables;
}

function renderTemplate(templateBody: string, values: Record<string, string>) {
  return templateBody.replace(/{{\s*([^}]+?)\s*}}/g, (_match, variableName: string) => {
    const key = variableName.trim();
    return values[key] ?? "";
  });
}

export function AIEmployeesFlow({ templates }: { templates: StoredTemplate[] }) {
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [copyLabel, setCopyLabel] = useState("Kopier");

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? null;

  const variables = useMemo(
    () => (selectedTemplate ? extractVariables(selectedTemplate.body) : []),
    [selectedTemplate],
  );

  function handleEmployeeUse(employeeName: string) {
    setSelectedEmployeeName(employeeName);
    setSelectedTemplateId("");
    setInputValues({});
    setResult("");
    setCopyLabel("Kopier");
  }

  function handleTemplateSelect(templateId: string) {
    setSelectedTemplateId(templateId);
    setInputValues({});
    setResult("");
    setCopyLabel("Kopier");
  }

  function handleGenerate() {
    if (!selectedTemplate) {
      return;
    }

    setResult(renderTemplate(selectedTemplate.body, inputValues));
    setCopyLabel("Kopier");
  }

  async function handleCopy() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result);
    setCopyLabel("Kopiert");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        {aiEmployees.map((employee) => (
          <AIEmployeeCard
            key={employee.name}
            name={employee.name}
            description={employee.description}
            avatar={employee.id}
            onUse={() => handleEmployeeUse(employee.name)}
          />
        ))}
      </div>

      {selectedEmployeeName ? (
        <section className="space-y-4">
          <h2 className="section-title">Maler</h2>
          {templates.length === 0 ? (
            <div className="surface-tile">
              <p className="section-copy">Ingen maler tilgjengelig</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => {
                const isSelected = template.id === selectedTemplateId;

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`surface-tile text-left transition ${
                      isSelected
                        ? "border-[color:var(--brand-border)] ring-2 ring-[rgba(27,23,255,0.14)]"
                        : ""
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-950">{template.name}</p>
                    <p className="section-copy mt-1">{template.type}</p>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {selectedTemplate ? (
        <section className="space-y-4">
          <h2 className="section-title">Fyll inn felter</h2>
          <div className="surface-tile space-y-4">
            {variables.map((variable) => (
              <label key={variable} className="block space-y-2">
                <span className="field-label">{variable}</span>
                <input
                  value={inputValues[variable] ?? ""}
                  onChange={(event) =>
                    setInputValues((current) => ({
                      ...current,
                      [variable]: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-slate-50"
                />
              </label>
            ))}

            <button type="button" className="button-primary" onClick={handleGenerate}>
              Generer
            </button>
          </div>
        </section>
      ) : null}

      {result ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="section-title">Resultat</h2>
            <button type="button" className="button-secondary" onClick={handleCopy}>
              {copyLabel}
            </button>
          </div>
          <div className="surface-tile">
            <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{result}</pre>
          </div>
        </section>
      ) : null}
    </div>
  );
}
