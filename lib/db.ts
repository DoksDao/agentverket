import "server-only";

import type { AuthenticatedAppSession } from "./auth-types";
import { createSupabaseClient } from "./supabase";
import type { StoredTemplate, TemplateType } from "./templates";
import { defaultTemplates } from "./templates";

const defaultAgents = [
  {
    name: "Salgs-AI",
    description:
      "Følger opp nye henvendelser, kvalifiserer potensielle kunder og foreslår neste salgsaktivitet.",
  },
  {
    name: "Tilbuds-AI",
    description:
      "Bygger tilbudsutkast raskt og konsistent med utgangspunkt i kundebehov, prislister og tidligere leveranser.",
  },
  {
    name: "Admin-AI",
    description:
      "Holder data oppdatert, organiserer dokumentasjon og automatiserer rutiner som ellers tar tid i hverdagen.",
  },
];

type WorkspaceRow = {
  id: string;
  name: string;
};

type UserRow = {
  id: string;
  email: string;
  workspace_id: string;
};

type AgentRow = {
  id: string;
  workspace_id: string;
  name: string;
  description: string;
  created_at: string;
};

type TemplateRow = {
  id: string;
  workspace_id: string;
  name: string;
  type: TemplateType;
  content: string;
  created_at: string;
};

type ActivityRow = {
  id: string;
  workspace_id: string;
  agent_id: string;
  template_id: string;
  result: string;
  created_at: string;
};

export interface AgentRecord {
  id: string;
  name: string;
  description: string;
}

export interface TaskRunRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  taskId: string;
  taskName: string;
  templateId: string;
  templateName: string;
  status: string;
  summary: string;
  inputs: Record<string, string>;
  createdAt: string;
}

function getSupabaseOrThrow() {
  const supabase = createSupabaseClient();

  if (!supabase) {
    throw new Error(
      "Supabase er ikke konfigurert. Legg inn NEXT_PUBLIC_SUPABASE_URL og NEXT_PUBLIC_SUPABASE_ANON_KEY i .env.local.",
    );
  }

  return supabase;
}

function deriveWorkspaceName(email: string, displayName?: string) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  const domain = email.split("@")[1] ?? "";
  const companyName = domain.split(".")[0] ?? "Arbeidsrom";

  if (!companyName) {
    return "Arbeidsrom";
  }

  return companyName
    .split(/[-_.]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function ensureDefaultAgents(workspaceId: string) {
  const supabase = getSupabaseOrThrow();
  const { data: existingAgents, error } = await supabase
    .from("agents")
    .select("id")
    .eq("workspace_id", workspaceId)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  if (existingAgents && existingAgents.length > 0) {
    return;
  }

  const { error: insertError } = await supabase.from("agents").insert(
    defaultAgents.map((agent) => ({
      workspace_id: workspaceId,
      name: agent.name,
      description: agent.description,
    })),
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

async function ensureDefaultTemplates(workspaceId: string) {
  const supabase = getSupabaseOrThrow();
  const { data: existingTemplates, error } = await supabase
    .from("templates")
    .select("id")
    .eq("workspace_id", workspaceId)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  if (existingTemplates && existingTemplates.length > 0) {
    return;
  }

  const { error: insertError } = await supabase.from("templates").insert(
    defaultTemplates.map((template) => ({
      workspace_id: workspaceId,
      name: template.name,
      type: template.type,
      content: template.body,
    })),
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function ensureWorkspaceForUserEmail(email: string, displayName?: string) {
  const supabase = getSupabaseOrThrow();
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingUser, error: userLookupError } = await supabase
    .from("users")
    .select("id, email, workspace_id")
    .eq("email", normalizedEmail)
    .maybeSingle<UserRow>();

  if (userLookupError) {
    throw new Error(userLookupError.message);
  }

  if (existingUser) {
    await ensureDefaultAgents(existingUser.workspace_id);
    await ensureDefaultTemplates(existingUser.workspace_id);
    return existingUser;
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: deriveWorkspaceName(normalizedEmail, displayName),
    })
    .select("id, name")
    .single<WorkspaceRow>();

  if (workspaceError || !workspace) {
    throw new Error(workspaceError?.message ?? "Kunne ikke opprette workspace.");
  }

  const { data: user, error: insertUserError } = await supabase
    .from("users")
    .insert({
      email: normalizedEmail,
      workspace_id: workspace.id,
    })
    .select("id, email, workspace_id")
    .single<UserRow>();

  if (insertUserError || !user) {
    throw new Error(insertUserError?.message ?? "Kunne ikke opprette bruker.");
  }

  await ensureDefaultAgents(workspace.id);
  await ensureDefaultTemplates(workspace.id);

  return user;
}

export async function getWorkspaceSessionByEmail(
  email: string,
  displayName: string,
): Promise<AuthenticatedAppSession> {
  const supabase = getSupabaseOrThrow();
  const normalizedEmail = email.trim().toLowerCase();

  const userRow = await ensureWorkspaceForUserEmail(normalizedEmail, displayName);

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("id", userRow.workspace_id)
    .single<WorkspaceRow>();

  if (error || !workspace) {
    throw new Error(error?.message ?? "Fant ikke workspace for brukeren.");
  }

  return {
    sessionId: userRow.id,
    user: {
      id: userRow.id,
      name: displayName,
      email: normalizedEmail,
    },
    workspace: {
      id: workspace.id,
      name: workspace.name,
    },
  };
}

export async function getWorkspaceByUserId(userId: string) {
  const supabase = getSupabaseOrThrow();
  const { data: userRow, error: userError } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", userId)
    .single<{ workspace_id: string }>();

  if (userError || !userRow) {
    throw new Error(userError?.message ?? "Fant ikke brukerens workspace_id.");
  }

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("id", userRow.workspace_id)
    .single<WorkspaceRow>();

  if (workspaceError || !workspace) {
    throw new Error(workspaceError?.message ?? "Fant ikke workspace for brukeren.");
  }

  return workspace;
}

export async function listAgentsByWorkspace(workspaceId: string): Promise<AgentRecord[]> {
  await ensureDefaultAgents(workspaceId);
  const supabase = getSupabaseOrThrow();

  const { data, error } = await supabase
    .from("agents")
    .select("id, name, description")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const seen = new Set<string>();

  return ((data ?? []) as AgentRecord[]).filter((agent) => {
    const key = agent.name.trim().toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function findAgentByName(workspaceId: string, name: string) {
  await ensureDefaultAgents(workspaceId);
  const supabase = getSupabaseOrThrow();

  const { data, error } = await supabase
    .from("agents")
    .select("id, name, description")
    .eq("workspace_id", workspaceId)
    .eq("name", name)
    .limit(1)
    .maybeSingle<AgentRow>();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? {
        id: data.id,
        name: data.name,
        description: data.description,
      }
    : null;
}

export async function listTemplatesByWorkspace(workspaceId: string): Promise<StoredTemplate[]> {
  await ensureDefaultTemplates(workspaceId);
  const supabase = getSupabaseOrThrow();
  const { data, error } = await supabase
    .from("templates")
    .select("id, workspace_id, name, type, content, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as TemplateRow[]).map((template) => ({
    id: template.id,
    name: template.name,
    type: template.type,
    body: template.content,
    updatedAt: template.created_at,
  }));
}

export async function getTemplateById(workspaceId: string, templateId: string) {
  const supabase = getSupabaseOrThrow();
  const { data, error } = await supabase
    .from("templates")
    .select("id, workspace_id, name, type, content, created_at")
    .eq("workspace_id", workspaceId)
    .eq("id", templateId)
    .maybeSingle<TemplateRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    body: data.content,
    updatedAt: data.created_at,
  } satisfies StoredTemplate;
}

export async function createWorkspaceTemplate(
  workspaceId: string,
  input: {
    name: string;
    type: TemplateType;
    body: string;
  },
) {
  const supabase = getSupabaseOrThrow();
  const { data, error } = await supabase
    .from("templates")
    .insert({
      workspace_id: workspaceId,
      name: input.name,
      type: input.type,
      content: input.body,
    })
    .select("id, workspace_id, name, type, content, created_at")
    .single<TemplateRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Kunne ikke lagre mal.");
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    body: data.content,
    updatedAt: data.created_at,
  } satisfies StoredTemplate;
}

export async function updateWorkspaceTemplate(
  workspaceId: string,
  templateId: string,
  input: {
    name: string;
    type: TemplateType;
    body: string;
  },
) {
  const supabase = getSupabaseOrThrow();
  const { data, error } = await supabase
    .from("templates")
    .update({
      name: input.name,
      type: input.type,
      content: input.body,
    })
    .eq("workspace_id", workspaceId)
    .eq("id", templateId)
    .select("id, workspace_id, name, type, content, created_at")
    .maybeSingle<TemplateRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    body: data.content,
    updatedAt: data.created_at,
  } satisfies StoredTemplate;
}

function parseActivityResult(result: string) {
  try {
    return JSON.parse(result) as Omit<TaskRunRecord, "id" | "createdAt">;
  } catch {
    return {
      employeeId: "",
      employeeName: "",
      taskId: "",
      taskName: "",
      templateId: "",
      templateName: "",
      status: "Fullført",
      summary: result,
      inputs: {},
    };
  }
}

export async function createTaskRun(
  workspaceId: string,
  input: Omit<TaskRunRecord, "id" | "createdAt">,
) {
  const supabase = getSupabaseOrThrow();
  const agent = await findAgentByName(workspaceId, input.employeeName);

  if (!agent) {
    throw new Error("Fant ikke agent i Supabase.");
  }

  const { data, error } = await supabase
    .from("activity")
    .insert({
      workspace_id: workspaceId,
      agent_id: agent.id,
      template_id: input.templateId,
      result: JSON.stringify(input),
    })
    .select("id, workspace_id, agent_id, template_id, result, created_at")
    .single<ActivityRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Kunne ikke lagre aktivitet.");
  }

  const parsed = parseActivityResult(data.result);

  return {
    id: data.id,
    ...parsed,
    createdAt: data.created_at,
  } satisfies TaskRunRecord;
}

export async function listTaskRunsByWorkspace(workspaceId: string, limit = 20) {
  const supabase = getSupabaseOrThrow();
  const { data, error } = await supabase
    .from("activity")
    .select("id, workspace_id, agent_id, template_id, result, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ActivityRow[]).map((row) => {
    const parsed = parseActivityResult(row.result);

    return {
      id: row.id,
      ...parsed,
      createdAt: row.created_at,
    } satisfies TaskRunRecord;
  });
}
