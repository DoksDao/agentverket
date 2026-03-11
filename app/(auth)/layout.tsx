"use client";

import { ReactNode, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--app-surface)] text-slate-950">
      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-[rgba(11,11,17,0.32)] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-auto px-3 py-3 sm:px-4 sm:py-4">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
