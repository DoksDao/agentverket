import { AIEmployeesFlow } from "../../../components/ai-employees/AIEmployeesFlow";
import { Container } from "../../../components/ui/container";
import { requireSession } from "../../../lib/auth";
import { listAgentsByWorkspace, listTemplatesByWorkspace } from "../../../lib/db";

export default async function AIEmployeesPage() {
  const session = await requireSession();
  const [agents, templates] = await Promise.all([
    listAgentsByWorkspace(session.workspace.id),
    listTemplatesByWorkspace(session.workspace.id),
  ]);

  return (
    <div className="space-y-6">
      <Container>
        <div className="container-header border-b-0 pb-0">
          <h1 className="page-title">AI-ansatte</h1>
          <div className="ai-title-signal mt-4" aria-hidden="true">
            <span className="ai-title-signal-dot ai-title-signal-dot-delay-1" />
            <span className="ai-title-signal-dot ai-title-signal-dot-delay-2" />
            <span className="ai-title-signal-dot ai-title-signal-dot-delay-3" />
          </div>
        </div>
      </Container>

      <Container>
        <AIEmployeesFlow agents={agents} templates={templates} />
      </Container>
    </div>
  );
}
