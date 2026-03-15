import { ReactNode } from "react";

import AuthenticatedShell from "../../components/auth/AuthenticatedShell";
import { requireSession } from "../../lib/auth";
import { getWorkspaceByUserId } from "../../lib/db";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  const workspace = await getWorkspaceByUserId(session.user.id);

  return (
    <AuthenticatedShell
      session={{
        ...session,
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
      }}
    >
      {children}
    </AuthenticatedShell>
  );
}
