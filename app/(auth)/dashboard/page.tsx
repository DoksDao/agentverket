import Link from "next/link";

import { AIEmployeeAvatar } from "../../../components/ai-employees/AIEmployeeCard";
import { Container } from "../../../components/ui/container";
import { requireSession } from "../../../lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <div className="space-y-6">
      <Container>
        <div className="container-header pb-0">
          <p className="page-kicker">Firma</p>
          <h1 className="page-title">{session.workspace.name}</h1>
        </div>
      </Container>

      <Container>
        <div className="container-header sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <AIEmployeeAvatar variant="offers" size={48} />
            <div>
              <h2 className="section-title">Tilbudsassistent</h2>
              <p className="section-copy mt-1">
              Lager profesjonelle tilbud for bygg og anlegg
              </p>
            </div>
          </div>
          <Link href="/tasks" className="button-primary">
            Lag tilbud
          </Link>
        </div>
      </Container>

      <Container>
        <div className="container-header">
          <h2 className="section-title">Siste tilbud</h2>
        </div>
        <div className="container-content">
          <p className="section-copy">Ingen tilbud ennå</p>
        </div>
      </Container>
    </div>
  );
}
