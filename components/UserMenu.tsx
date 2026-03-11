"use client";

import { useState, useRef, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{user.name}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg py-1 text-sm dark:bg-gray-700">
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Profil
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Logg ut
          </a>
        </div>
      )}
    </div>
  );
}
