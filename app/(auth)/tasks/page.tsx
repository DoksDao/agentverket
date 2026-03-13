import { TasksPageClient } from "../../../components/tasks/TasksPageClient";
import { requireSession } from "../../../lib/auth";
import { listTaskRunsByWorkspace, listTemplatesByWorkspace } from "../../../lib/db";

export default async function TasksPage() {
  const session = await requireSession();
  const templates = listTemplatesByWorkspace(session.workspace.id);
  const latestRun = listTaskRunsByWorkspace(session.workspace.id, 1)[0] ?? null;

  return (
    <TasksPageClient
      templates={templates}
      initialRunResult={
        latestRun
          ? {
              title: "Sist lagrede oppgave",
              status: latestRun.status,
              summary: latestRun.summary,
              employeeName: latestRun.employeeName,
              taskName: latestRun.taskName,
              templateName: latestRun.templateName,
              createdAt: latestRun.createdAt,
            }
          : null
      }
    />
  );
}
