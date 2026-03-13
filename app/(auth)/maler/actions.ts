"use server";

import { redirect } from "next/navigation";

import { requireSession } from "../../../lib/auth";
import { createWorkspaceTemplate, updateWorkspaceTemplate } from "../../../lib/db";
import type { TemplateType } from "../../../lib/templates";

function parseTemplatePayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim() as TemplateType;
  const body = String(formData.get("body") ?? "").trim();

  if (!name || !body || !["Tilbud", "E-post", "Rapport"].includes(type)) {
    throw new Error("Ugyldig maldata.");
  }

  return {
    name,
    type,
    body,
  };
}

export async function createTemplateAction(formData: FormData) {
  const session = await requireSession();
  const payload = parseTemplatePayload(formData);

  createWorkspaceTemplate(session.workspace.id, payload);
  redirect("/maler");
}

export async function updateTemplateAction(formData: FormData) {
  const session = await requireSession();
  const templateId = String(formData.get("templateId") ?? "");
  const payload = parseTemplatePayload(formData);

  if (!templateId) {
    throw new Error("Mangler templateId.");
  }

  const updated = updateWorkspaceTemplate(session.workspace.id, templateId, payload);

  if (!updated) {
    throw new Error("Fant ikke malen som skulle oppdateres.");
  }

  redirect("/maler");
}
