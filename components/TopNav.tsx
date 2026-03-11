"use client";

import { mockWorkspace, mockUser } from "../lib/mockData";
import UserMenu from "./UserMenu";

interface TopNavProps {
  onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/78">
      <div className="flex min-h-[72px] w-full items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md p-1 text-slate-600 focus:outline-none md:hidden"
            onClick={onMenuClick}
            aria-label="Åpne meny"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="meta-label">
              Arbeidsrom
            </p>
            <span className="text-sm font-medium text-slate-950">
              {mockWorkspace.name}
            </span>
          </div>
          <UserMenu user={mockUser} />
        </div>
      </div>
    </header>
  );
}
