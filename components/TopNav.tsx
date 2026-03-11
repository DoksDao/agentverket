"use client";

import { mockWorkspace, mockUser } from "../lib/mockData";
import UserMenu from "./UserMenu";

interface TopNavProps {
  onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
  // mobile menu toggle may be handled at layout level if needed

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        {/* mobile hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-700 dark:text-gray-300"
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
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {mockWorkspace.name}
        </span>
      </div>
      <div className="flex items-center">
        <UserMenu user={mockUser} />
      </div>
    </header>
  );
}
