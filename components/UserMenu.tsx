"use client";

import { useState, useRef, useEffect } from "react";
import { logoutAction } from "../app/login/actions";
import { UserAvatar } from "./UserAvatar";

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
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-[0_10px_30px_-24px_rgba(27,23,255,0.45)] focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Brukermeny for ${user.name}`}
      >
        <UserAvatar />
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
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-[0_16px_40px_-32px_rgba(27,23,255,0.32)]">
          <a
            href="#"
            className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Profil
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50"
            >
              Logg ut
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
