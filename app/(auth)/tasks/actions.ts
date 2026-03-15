"use server";

import { requireSession } from "../../../lib/auth";
import { createTaskRun, getTemplateById } from "../../../lib/db";
import { findEmployeeTask } from "../../../lib/task-catalog";

export async function runTaskAction(input: {
  employeeId: string;
  taskId: string;
  templateId: string;
  formValues: Record<string, string>;
}) {
  const session = await requireSession();
  const taskMatch = findEmployeeTask(input.employeeId, input.taskId);

  if (!taskMatch) {
    throw new Error("Fant ikke valgt AI-ansatt eller oppgave.");
  }

  const template = await getTemplateById(session.workspace.id, input.templateId);

  if (!template) {
    throw new Error("Fant ikke valgt mal.");
  }

  if (template.type !== taskMatch.task.templateType) {
    throw new Error("Valgt mal passer ikke til oppgaven.");
  }

  const missingInput = taskMatch.task.inputs.find(
    (field) => !String(input.formValues[field.id] ?? "").trim(),
  );

  if (missingInput) {
    throw new Error(`Mangler innhold for ${missingInput.label}.`);
  }

  const filledFields = taskMatch.task.inputs
    .map((field) => `${field.label}: ${input.formValues[field.id] ?? ""}`)
    .join(" | ");

  const created = await createTaskRun(session.workspace.id, {
    employeeId: taskMatch.employee.id,
    employeeName: taskMatch.employee.name,
    taskId: taskMatch.task.id,
    taskName: taskMatch.task.name,
    templateId: template.id,
    templateName: template.name,
    status: "Klar for gjennomgang",
    summary: `${taskMatch.task.resultSummary} Brukt mal: ${template.name}. Inndata: ${filledFields}.`,
    inputs: input.formValues,
  });

  if (!created) {
    throw new Error("Kunne ikke lagre oppgaven.");
  }

  return {
    title: taskMatch.task.resultLabel,
    status: created.status,
    summary: created.summary,
    employeeName: created.employeeName,
    taskName: created.taskName,
    templateName: created.templateName,
    createdAt: created.createdAt,
  };
}
