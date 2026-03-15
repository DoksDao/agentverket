import { ActivityRow } from "../../../components/activity/ActivityRow";
import { Container } from "../../../components/ui/container";
import { requireSession } from "../../../lib/auth";
import { listTaskRunsByWorkspace } from "../../../lib/db";

function formatActivityTime(dateString: string) {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export default async function ActivityPage() {
  const session = await requireSession();
  const runs = await listTaskRunsByWorkspace(session.workspace.id, 20);
  const activityItems = runs.map((run) => ({
    taskName: run.taskName,
    aiEmployee: run.employeeName,
    time: formatActivityTime(run.createdAt),
    status: run.status,
    details: run.summary,
  }));

  return (
    <div className="space-y-6">
      <Container>
        <div className="container-header pb-0">
          <h1 className="page-title">Aktivitet</h1>
        </div>
      </Container>

      <Container>
        <div className="meta-label container-content hidden grid-cols-[1.2fr_1fr_0.9fr_0.7fr_0.7fr] gap-4 px-4 lg:grid">
          <span>Oppgave</span>
          <span>AI-ansatt</span>
          <span>Tidspunkt</span>
          <span>Status</span>
          <span className="text-right">Detaljer</span>
        </div>

        <div className="container-content space-y-3">
          {activityItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
              <p className="section-copy">Ingen aktivitet lagret ennå</p>
            </div>
          ) : (
            activityItems.map((activity) => (
              <ActivityRow key={`${activity.taskName}-${activity.time}`} {...activity} />
            ))
          )}
        </div>
      </Container>
    </div>
  );
}
