"use client";

export function UserAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#f8fafc" stroke="#dbeafe" strokeWidth="1" />
      <path d="M7 31c2-5 6-8 9-8s7 3 9 8" fill="#334155" />
      <ellipse cx="16" cy="14" rx="7" ry="8" fill="#efc8aa" />
      <path d="M10 13c2-6 6-10 10-10 6 0 10 4 12 10-3-2-7-4-12-4-4 0-7 1-10 4Z" fill="#475569" />
      <circle cx="13" cy="14" r="1" fill="#0f172a" />
      <circle cx="19" cy="14" r="1" fill="#0f172a" />
      <path d="M16 15.5v3.5" stroke="#9a6a52" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M13 20c1.2 1.1 2.1 1.5 3 1.5s1.8-.4 3-1.5" stroke="#7c2d12" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
