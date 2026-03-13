"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Oversikt", href: "/oversikt" },
  { label: "AI-ansatte", href: "/ai-employees" },
  { label: "Aktivitet", href: "/activity" },
  { label: "Maler", href: "/maler" },
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
      className={`fixed inset-y-0 left-0 z-20 w-60 transform border-r border-slate-200 bg-[var(--app-sidebar)] text-slate-950 transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundColor: "#f1f3f7" }}
    >
      <div className="h-full overflow-auto">
        <div className="flex min-h-[72px] items-center border-b border-slate-200 px-4">
          <div className="w-[220px]">
            <Image
              src="/agentverket-logo-transparent.png"
              alt="Agentverket"
              width={1306}
              height={368}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
        </div>
        <ul className="mt-3 space-y-1 px-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-[rgba(27,23,255,0.12)] text-[var(--brand)]"
                      : "text-slate-500 hover:bg-[rgba(27,23,255,0.08)] hover:text-[var(--brand)]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
