"use client";

import Link from "next/link";
import {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import { runTaskAction } from "../../app/(auth)/tasks/actions";
import { Container } from "../ui/container";
import { employees } from "../../lib/task-catalog";
import type { StoredTemplate } from "../../lib/templates";

type StepState = "active" | "complete" | "upcoming";

type RunResult = {
  title: string;
  status: string;
  summary: string;
  employeeName: string;
  taskName: string;
  templateName: string;
  createdAt?: string;
};

const stepLabels = [
  "Velg AI-ansatt",
  "Velg oppgave",
  "Velg mal",
  "Fyll inn informasjon",
  "Kjør oppgave",
];

function getStepClasses(state: StepState) {
  if (state === "active") {
    return "border-[color:var(--brand-border)] bg-[var(--brand)] text-white";
  }

  if (state === "complete") {
    return "border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border-slate-200 bg-white text-slate-400";
}

function getSectionClasses(state: StepState) {
  if (state === "active") {
    return "border-[color:var(--brand-border)] bg-white opacity-100";
  }

  if (state === "complete") {
    return "border-slate-200 bg-slate-50/85 opacity-90";
  }

  return "border-slate-200 bg-white/80 opacity-70";
}

function StepSection({
  visible,
  state,
  stepNumber,
  title,
  description,
  badge,
  stepRef,
  children,
}: {
  visible: boolean;
  state: StepState;
  stepNumber: number;
  title: string;
  description: string;
  badge: string;
  stepRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  if (!visible) {
    return null;
  }

  return (
    <Container
      className={`${getSectionClasses(state)} [animation:fade-slide-in_240ms_ease-out]`}
      ref={stepRef}
    >
      <div className="container-header">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="meta-label">Steg {stepNumber}</p>
            <h2 className="section-title mt-2">{title}</h2>
            <p className="section-subtitle mt-1">{description}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {badge}
          </span>
        </div>
      </div>

      <div className="container-content">{children}</div>
    </Container>
  );
}

export function TasksPageClient({
  templates,
  initialRunResult,
}: {
  templates: StoredTemplate[];
  initialRunResult?: RunResult | null;
}) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [runResult, setRunResult] = useState<RunResult>(
    initialRunResult ?? {
      title: "Ingen oppgave kjørt ennå",
      status: "Venter",
      summary:
        "Velg AI-ansatt, oppgave og mal for å åpne resten av flyten. Resultatet vises her når oppgaven er kjørt.",
      employeeName: "",
      taskName: "",
      templateName: "",
    },
  );
  const [runError, setRunError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const step2Ref = useRef<HTMLElement>(null);
  const step3Ref = useRef<HTMLElement>(null);
  const step4Ref = useRef<HTMLElement>(null);
  const step5Ref = useRef<HTMLElement>(null);

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null;
  const selectedTask =
    selectedEmployee?.tasks.find((task) => task.id === selectedTaskId) ?? null;
  const relevantTemplates = selectedTask
    ? templates.filter((template) => template.type === selectedTask.templateType)
    : [];
  const selectedTemplate =
    relevantTemplates.find((template) => template.id === selectedTemplateId) ?? null;

  const allInputsFilled = selectedTask
    ? selectedTask.inputs.every((input) => (formValues[input.id] ?? "").trim().length > 0)
    : false;

  const currentStep = !selectedEmployee
    ? 1
    : !selectedTask
      ? 2
      : !selectedTemplate
        ? 3
        : !allInputsFilled
          ? 4
          : 5;

  const canRunTask = Boolean(
    selectedEmployee && selectedTask && selectedTemplate && allInputsFilled && !isSaving,
  );

  useEffect(() => {
    const refMap: Record<number, RefObject<HTMLElement | null>> = {
      2: step2Ref,
      3: step3Ref,
      4: step4Ref,
      5: step5Ref,
    };

    const nextRef = refMap[currentStep];
    if (nextRef?.current) {
      nextRef.current.focus({ preventScroll: true });
    }
  }, [currentStep]);

  function handleEmployeeSelect(employeeId: string) {
    setSelectedEmployeeId(employeeId);
    setSelectedTaskId(null);
    setSelectedTemplateId("");
    setFormValues({});
    setRunError("");
  }

  function handleTaskSelect(taskId: string) {
    const nextTask = selectedEmployee?.tasks.find((task) => task.id === taskId) ?? null;
    setSelectedTaskId(taskId);
    setSelectedTemplateId("");
    setFormValues(
      nextTask
        ? Object.fromEntries(nextTask.inputs.map((input) => [input.id, input.defaultValue]))
        : {},
    );
    setRunError("");
  }

  function handleInputChange(inputId: string, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [inputId]: value,
    }));
  }

  async function handleRunTask() {
    if (!selectedEmployee || !selectedTask || !selectedTemplate || !canRunTask) {
      return;
    }

    setRunError("");
    setIsSaving(true);

    try {
      const result = await runTaskAction({
        employeeId: selectedEmployee.id,
        taskId: selectedTask.id,
        templateId: selectedTemplate.id,
        formValues,
      });

      setRunResult(result);
    } catch (error) {
      setRunError(error instanceof Error ? error.message : "Kunne ikke lagre oppgaven.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Container className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          {stepLabels.map((label, index) => {
            const state: StepState =
              index + 1 < currentStep
                ? "complete"
                : index + 1 === currentStep
                  ? "active"
                  : "upcoming";

            return (
              <div
                key={label}
                className={`flex min-w-0 flex-1 items-center gap-2 rounded-full border px-3 py-2 transition ${getStepClasses(state)}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 text-[11px] font-semibold text-slate-900">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      <section className="space-y-3">
        <Container className="p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="meta-label">Valg</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              AI-ansatt: {selectedEmployee?.name ?? "Ikke valgt"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Oppgave: {selectedTask?.name ?? "Ikke valgt"}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Mal: {selectedTemplate?.name ?? "Ikke valgt"}
            </span>
          </div>
        </Container>

        <div className="space-y-3">
          <StepSection
            visible
            state={!selectedEmployee ? "active" : "complete"}
            stepNumber={1}
            title="Velg AI-ansatt"
            description="Start med å velge hvilken AI-ansatt som skal utføre oppgaven."
            badge={!selectedEmployee ? "Aktivt steg" : "Valgt"}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {employees.map((employee) => {
                const isSelected = employee.id === selectedEmployeeId;

                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => handleEmployeeSelect(employee.id)}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      isSelected
                        ? "border-[color:var(--brand-border)] bg-[var(--brand)] text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <p className={`meta-label ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      {employee.role}
                    </p>
                    <h3 className="section-title mt-2">{employee.name}</h3>
                    <p className={`section-copy mt-3 ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                      {employee.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </StepSection>

          <StepSection
            visible={Boolean(selectedEmployee)}
            state={!selectedTask ? "active" : "complete"}
            stepNumber={2}
            title="Velg oppgave"
            description="Når AI-ansatt er valgt, vises bare relevante oppgaver for denne rollen."
            badge={!selectedTask ? "Aktivt steg" : "Valgt"}
            stepRef={step2Ref}
          >
            <div className="border-b border-slate-200 pb-4">
              <p className="meta-label">Aktiv oppgaveliste</p>
              <p className="mt-2 text-sm font-medium text-slate-950">
                {selectedEmployee?.name} har {selectedEmployee?.tasks.length ?? 0} relevante oppgaver tilgjengelig.
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {selectedEmployee?.tasks.map((task) => {
                const isSelected = task.id === selectedTaskId;

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleTaskSelect(task.id)}
                    className={`rounded-[24px] border p-5 text-left transition ${
                      isSelected
                        ? "border-[color:var(--brand-border)] bg-[var(--brand)] text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <h3 className="section-title">{task.name}</h3>
                    <p className={`section-copy mt-3 ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                      {task.description}
                    </p>
                    <p className={`meta-label mt-4 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                      Krever maltype: {task.templateType}
                    </p>
                  </button>
                );
              })}
            </div>
          </StepSection>

          <StepSection
            visible={Boolean(selectedTask)}
            state={!selectedTemplate ? "active" : "complete"}
            stepNumber={3}
            title="Velg mal"
            description="Velg en lagret mal som matcher oppgaven og som skal styre struktur og språk."
            badge={!selectedTemplate ? "Aktivt steg" : "Valgt"}
            stepRef={step3Ref}
          >
            {relevantTemplates.length === 0 ? (
              <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5">
                <h3 className="section-title">Ingen maler tilgjengelig for denne oppgaven</h3>
                <p className="section-copy mt-2">
                  Opprett eller oppdater en mal av typen {selectedTask?.templateType.toLowerCase()} før du går videre.
                </p>
                <Link href="/maler" className="button-primary mt-5">
                  Gå til maler
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-4">
                    <p className="meta-label">Tilgjengelige maler</p>
                    <p className="mt-2 text-sm font-medium text-slate-950">
                      {relevantTemplates.length} maler passer til oppgaven {selectedTask?.name.toLowerCase()}.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {relevantTemplates.map((template) => {
                      const isSelected = template.id === selectedTemplateId;

                      return (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={`w-full rounded-[20px] border p-4 text-left transition ${
                            isSelected
                              ? "border-[color:var(--brand-border)] bg-[var(--brand)] text-white"
                              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <p className={`meta-label ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                            {template.type}
                          </p>
                          <h3 className="section-title mt-2">{template.name}</h3>
                          <p className={`section-copy mt-2 ${isSelected ? "text-slate-200" : "text-slate-600"}`}>
                            Velg denne malen for å bruke struktur og formuleringer i oppgaven.
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[20px] border border-slate-200 p-4">
                  <p className="meta-label">Preview av valgt mal</p>
                  <p className="section-title mt-2">{selectedTemplate?.name ?? "Ingen mal valgt"}</p>
                  <p className="page-copy mt-1">
                    {selectedTemplate?.type ?? "Velg en mal for å se innhold"}
                  </p>
                  <div className="mt-3 rounded-2xl bg-slate-50 p-3">
                    <p className="section-copy whitespace-pre-wrap">
                      {selectedTemplate?.body ?? "Når du velger en mal, vises innholdet her."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </StepSection>

          <StepSection
            visible={Boolean(selectedTemplate)}
            state={!allInputsFilled ? "active" : "complete"}
            stepNumber={4}
            title="Fyll inn informasjon"
            description="Legg inn grunnlaget AI-ansatt trenger for å utføre oppgaven med valgt mal."
            badge={!allInputsFilled ? "Aktivt steg" : "Klar"}
            stepRef={step4Ref}
          >
            <div className="rounded-2xl border border-[color:var(--brand-border)] bg-[var(--brand-soft)] p-3">
              <p className="meta-label">Aktiv arbeidsflyt</p>
              <p className="mt-2 text-sm font-medium text-slate-950">
                {selectedEmployee?.name} / {selectedTask?.name} / {selectedTemplate?.name}
              </p>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {selectedTask?.inputs.map((input) => (
                <label
                  key={input.id}
                  className={input.kind === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
                >
                  <span className="field-label">{input.label}</span>
                  {input.kind === "textarea" ? (
                    <textarea
                      value={formValues[input.id] ?? ""}
                      onChange={(event) => handleInputChange(input.id, event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-slate-300 focus:bg-slate-50"
                    />
                  ) : (
                    <input
                      value={formValues[input.id] ?? ""}
                      onChange={(event) => handleInputChange(input.id, event.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-slate-50"
                    />
                  )}
                </label>
              ))}
            </div>
          </StepSection>

          <StepSection
            visible={Boolean(selectedTemplate && allInputsFilled)}
            state="active"
            stepNumber={5}
            title="Kjør oppgave"
            description="Når alt er fylt inn, kan du kjøre oppgaven og få resultatet presentert til høyre."
            badge="Klar til kjøring"
            stepRef={step5Ref}
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-[color:var(--brand-border)] bg-[var(--brand-soft)] p-3">
                <p className="meta-label">Klar oppsummering</p>
                <p className="section-copy mt-2">
                  AI-ansatt, oppgave, mal og all nødvendig informasjon er registrert.
                </p>
              </div>

              {runError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {runError}
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canRunTask}
                onClick={handleRunTask}
                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  canRunTask
                    ? "bg-[var(--brand)] text-white hover:bg-[#1713e6]"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
              >
                {isSaving ? "Lagrer oppgave..." : "Kjør oppgave"}
              </button>

              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{runResult.title}</p>
                    <p className="meta-label mt-1 text-emerald-700">{runResult.status}</p>
                  </div>
                  <span className="brand-badge rounded-full px-3 py-1 text-xs font-semibold">
                    Lagret i databasen
                  </span>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="meta-label">AI-ansatt</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {runResult.employeeName || "Ingen valgt"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="meta-label">Oppgave</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {runResult.taskName || "Ingen valgt"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <p className="meta-label">Mal</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">
                      {runResult.templateName || "Ingen valgt"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="meta-label">Resultat</p>
                  <p className="section-copy mt-1">{runResult.summary}</p>
                </div>
              </div>
            </div>
          </StepSection>
        </div>
      </section>
    </div>
  );
}
