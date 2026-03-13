"use client";

import { createContext, useContext } from "react";

import type { AuthenticatedAppSession } from "../../lib/auth-types";

const AppSessionContext = createContext<AuthenticatedAppSession | null>(null);

export function AppSessionProvider({
  value,
  children,
}: {
  value: AuthenticatedAppSession;
  children: React.ReactNode;
}) {
  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const value = useContext(AppSessionContext);

  if (!value) {
    throw new Error("useAppSession must be used within AppSessionProvider.");
  }

  return value;
}
