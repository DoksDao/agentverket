import "server-only";

import Database from "better-sqlite3";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { AppUser, AppWorkspace, AuthenticatedAppSession } from "./auth-types";
import type { StoredTemplate, TemplateType } from "./templates";
import { defaultTemplates } from "./templates";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "agentverket.sqlite");

const DEFAULT_LOGIN_EMAIL =
  process.env.DEMO_LOGIN_EMAIL ?? "ingrid.nilsen@nordlysvekst.no";
const DEFAULT_LOGIN_PASSWORD =
  process.env.DEMO_LOGIN_PASSWORD ?? "Agentverket2026!";

type SessionRow = {
  sessionId: string;
  token: string;
  expiresAt: string;
  userId: string;
  userName: string;
  userEmail: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
};

type TemplateRow = {
  id: string;
  name: string;
  type: TemplateType;
  body: string;
  updatedAt: string;
};

type TaskRunRow = {
  id: string;
  employeeId: string;
  employeeName: string;
  taskId: string;
  taskName: string;
  templateId: string;
  templateName: string;
  status: string;
  summary: string;
  inputPayload: string;
  createdAt: string;
};

function ensureDataDirectory() {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

function hashPassword(password: string, salt = randomUUID()) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (candidateHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, storedBuffer);
}

function mapSession(row: SessionRow): AuthenticatedAppSession {
  return {
    sessionId: row.sessionId,
    user: {
      id: row.userId,
      name: row.userName,
      email: row.userEmail,
    },
    workspace: {
      id: row.workspaceId,
      name: row.workspaceName,
      slug: row.workspaceSlug,
    },
  };
}

ensureDataDirectory();

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS task_runs (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    task_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    template_id TEXT NOT NULL,
    template_name TEXT NOT NULL,
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    input_payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_templates_workspace_updated ON templates(workspace_id, updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_task_runs_workspace_created ON task_runs(workspace_id, created_at DESC);
`);

const workspaceId = "workspace_nordlys_vekst";
const defaultUserId = "user_ingrid_nilsen";
const now = new Date().toISOString();

database
  .prepare(
    `
      INSERT INTO workspaces (id, name, slug, created_at)
      VALUES (@id, @name, @slug, @createdAt)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        slug = excluded.slug
    `,
  )
  .run({
    id: workspaceId,
    name: "Nordlys Vekst",
    slug: "nordlys-vekst",
    createdAt: now,
  });

database
  .prepare(
    `
      INSERT INTO users (id, workspace_id, name, email, password_hash, created_at)
      VALUES (@id, @workspaceId, @name, @email, @passwordHash, @createdAt)
      ON CONFLICT(email) DO UPDATE SET
        workspace_id = excluded.workspace_id,
        name = excluded.name,
        password_hash = excluded.password_hash
    `,
  )
  .run({
    id: defaultUserId,
    workspaceId,
    name: "Ingrid Nilsen",
    email: DEFAULT_LOGIN_EMAIL.toLowerCase(),
    passwordHash: hashPassword(DEFAULT_LOGIN_PASSWORD),
    createdAt: now,
  });

const templateCount = database
  .prepare("SELECT COUNT(*) as count FROM templates WHERE workspace_id = ?")
  .get(workspaceId) as { count: number };

if (templateCount.count === 0) {
  const insertTemplate = database.prepare(
    `
      INSERT INTO templates (id, workspace_id, name, type, body, updated_at, created_at)
      VALUES (@id, @workspaceId, @name, @type, @body, @updatedAt, @createdAt)
    `,
  );

  const insertMany = database.transaction(() => {
    for (const template of defaultTemplates) {
      insertTemplate.run({
        id: `${workspaceId}_${template.id}`,
        workspaceId,
        name: template.name,
        type: template.type,
        body: template.body,
        updatedAt: template.updatedAt,
        createdAt: template.updatedAt,
      });
    }
  });

  insertMany();
}

export function getDemoCredentials() {
  return {
    email: DEFAULT_LOGIN_EMAIL,
    password: DEFAULT_LOGIN_PASSWORD,
  };
}

export function findUserByEmail(email: string) {
  const row = database
    .prepare(
      `
        SELECT
          users.id,
          users.name,
          users.email,
          users.password_hash AS passwordHash,
          workspaces.id AS workspaceId,
          workspaces.name AS workspaceName,
          workspaces.slug AS workspaceSlug
        FROM users
        INNER JOIN workspaces ON workspaces.id = users.workspace_id
        WHERE lower(users.email) = lower(?)
        LIMIT 1
      `,
    )
    .get(email) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return row;
}

export function authenticateUser(email: string, password: string) {
  const user = findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    } satisfies AppUser,
    workspace: {
      id: user.workspaceId,
      name: user.workspaceName,
      slug: user.workspaceSlug,
    } satisfies AppWorkspace,
  };
}

export function createDatabaseSession(userId: string) {
  const sessionId = randomUUID();
  const token = randomUUID();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 1000 * 60 * 60 * 8);

  database
    .prepare(
      `
        INSERT INTO sessions (id, token, user_id, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
    )
    .run(sessionId, token, userId, expiresAt.toISOString(), createdAt.toISOString());

  return {
    sessionId,
    token,
    expiresAt,
  };
}

export function deleteDatabaseSession(token: string) {
  database.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function deleteExpiredSessions() {
  database
    .prepare("DELETE FROM sessions WHERE datetime(expires_at) <= datetime(?)")
    .run(new Date().toISOString());
}

export function findSessionByToken(token: string) {
  deleteExpiredSessions();

  const row = database
    .prepare(
      `
        SELECT
          sessions.id AS sessionId,
          sessions.token AS token,
          sessions.expires_at AS expiresAt,
          users.id AS userId,
          users.name AS userName,
          users.email AS userEmail,
          workspaces.id AS workspaceId,
          workspaces.name AS workspaceName,
          workspaces.slug AS workspaceSlug
        FROM sessions
        INNER JOIN users ON users.id = sessions.user_id
        INNER JOIN workspaces ON workspaces.id = users.workspace_id
        WHERE sessions.token = ?
        LIMIT 1
      `,
    )
    .get(token) as SessionRow | undefined;

  if (!row) {
    return null;
  }

  if (new Date(row.expiresAt).getTime() <= Date.now()) {
    deleteDatabaseSession(token);
    return null;
  }

  return mapSession(row);
}

export function listTemplatesByWorkspace(workspaceId: string): StoredTemplate[] {
  return database
    .prepare(
      `
        SELECT id, name, type, body, updated_at as updatedAt
        FROM templates
        WHERE workspace_id = ?
        ORDER BY datetime(updated_at) DESC
      `,
    )
    .all(workspaceId) as StoredTemplate[];
}

export function getTemplateById(workspaceId: string, templateId: string) {
  const row = database
    .prepare(
      `
        SELECT id, name, type, body, updated_at as updatedAt
        FROM templates
        WHERE workspace_id = ? AND id = ?
        LIMIT 1
      `,
    )
    .get(workspaceId, templateId) as TemplateRow | undefined;

  return row ?? null;
}

export function createWorkspaceTemplate(
  workspaceId: string,
  input: {
    name: string;
    type: TemplateType;
    body: string;
  },
) {
  const id = randomUUID();
  const timestamp = new Date().toISOString();

  database
    .prepare(
      `
        INSERT INTO templates (id, workspace_id, name, type, body, updated_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(id, workspaceId, input.name, input.type, input.body, timestamp, timestamp);

  return getTemplateById(workspaceId, id);
}

export function updateWorkspaceTemplate(
  workspaceId: string,
  templateId: string,
  input: {
    name: string;
    type: TemplateType;
    body: string;
  },
) {
  const timestamp = new Date().toISOString();

  const result = database
    .prepare(
      `
        UPDATE templates
        SET name = ?, type = ?, body = ?, updated_at = ?
        WHERE workspace_id = ? AND id = ?
      `,
    )
    .run(input.name, input.type, input.body, timestamp, workspaceId, templateId);

  if (result.changes === 0) {
    return null;
  }

  return getTemplateById(workspaceId, templateId);
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

export function createTaskRun(
  workspaceId: string,
  userId: string,
  input: Omit<TaskRunRecord, "id" | "createdAt">,
) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  database
    .prepare(
      `
        INSERT INTO task_runs (
          id,
          workspace_id,
          user_id,
          employee_id,
          employee_name,
          task_id,
          task_name,
          template_id,
          template_name,
          status,
          summary,
          input_payload,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      id,
      workspaceId,
      userId,
      input.employeeId,
      input.employeeName,
      input.taskId,
      input.taskName,
      input.templateId,
      input.templateName,
      input.status,
      input.summary,
      JSON.stringify(input.inputs),
      createdAt,
    );

  return getTaskRunById(workspaceId, id);
}

export function getTaskRunById(workspaceId: string, runId: string) {
  const row = database
    .prepare(
      `
        SELECT
          id,
          employee_id as employeeId,
          employee_name as employeeName,
          task_id as taskId,
          task_name as taskName,
          template_id as templateId,
          template_name as templateName,
          status,
          summary,
          input_payload as inputPayload,
          created_at as createdAt
        FROM task_runs
        WHERE workspace_id = ? AND id = ?
        LIMIT 1
      `,
    )
    .get(workspaceId, runId) as TaskRunRow | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    taskId: row.taskId,
    taskName: row.taskName,
    templateId: row.templateId,
    templateName: row.templateName,
    status: row.status,
    summary: row.summary,
    inputs: JSON.parse(row.inputPayload) as Record<string, string>,
    createdAt: row.createdAt,
  } satisfies TaskRunRecord;
}

export function listTaskRunsByWorkspace(workspaceId: string, limit = 20) {
  const rows = database
    .prepare(
      `
        SELECT
          id,
          employee_id as employeeId,
          employee_name as employeeName,
          task_id as taskId,
          task_name as taskName,
          template_id as templateId,
          template_name as templateName,
          status,
          summary,
          input_payload as inputPayload,
          created_at as createdAt
        FROM task_runs
        WHERE workspace_id = ?
        ORDER BY datetime(created_at) DESC
        LIMIT ?
      `,
    )
    .all(workspaceId, limit) as TaskRunRow[];

  return rows.map((row) => ({
    id: row.id,
    employeeId: row.employeeId,
    employeeName: row.employeeName,
    taskId: row.taskId,
    taskName: row.taskName,
    templateId: row.templateId,
    templateName: row.templateName,
    status: row.status,
    summary: row.summary,
    inputs: JSON.parse(row.inputPayload) as Record<string, string>,
    createdAt: row.createdAt,
  })) satisfies TaskRunRecord[];
}
