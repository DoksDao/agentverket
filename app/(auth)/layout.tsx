import { ReactNode } from "react";

import AuthenticatedShell from "../../components/auth/AuthenticatedShell";
import { requireSession } from "../../lib/auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();

  return <AuthenticatedShell session={session}>{children}</AuthenticatedShell>;
}
