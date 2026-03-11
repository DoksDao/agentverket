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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* sidebar */}
      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      {/* overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* main area */}
      <div className="flex flex-col flex-1 md:pl-64">
        <TopNav onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
