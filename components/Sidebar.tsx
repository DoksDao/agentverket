"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Oversikt", href: "/" },
  { label: "AI-ansatte", href: "/ai-employees" },
  { label: "Oppgaver", href: "/tasks" },
  { label: "Aktivitet", href: "/activity" },
  { label: "Integrasjoner", href: "/integrations" },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  // close mobile sidebar when navigation changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-md transition-transform duration-200 ease-in-out dark:bg-gray-800 md:relative md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full overflow-auto">
        <div className="px-6 py-4 text-lg font-semibold">
          Agentverket
        </div>
        <ul className="mt-4 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    active
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
