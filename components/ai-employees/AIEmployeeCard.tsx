"use client";

export type AvatarVariant = "sales" | "offers" | "admin";

interface AIEmployeeCardProps {
  name: string;
  description: string;
  avatar: AvatarVariant;
  onUse: () => void;
}

export function AIEmployeeAvatar({
  variant,
  size = 80,
}: {
  variant: AvatarVariant;
  size?: number;
}) {
  const config = {
    sales: {
      hair: "#1f2937",
      shirt: "#2563eb",
    },
    offers: {
      hair: "#f2c66d",
      shirt: "#16a34a",
    },
    admin: {
      hair: "#7c4a2d",
      shirt: "#6b7280",
    },
  }[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={size === 48 ? "h-12 w-12" : "h-20 w-20"}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="38" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <path d="M18 70c4-11 14-17 22-17s18 6 22 17" fill={config.shirt} />
      <ellipse cx="40" cy="34" rx="18" ry="20" fill="#f4c7a1" />
      <path
        d={
          variant === "sales"
            ? "M22 32c1-11 9-18 18-18 10 0 18 7 19 18-4-5-9-8-17-8-8 0-14 3-20 8Z"
            : variant === "offers"
              ? "M21 31c2-11 10-17 19-17 10 0 18 6 19 17-5-3-11-5-19-5s-14 2-19 5Z"
              : "M22 33c2-10 9-17 18-17 10 0 17 7 18 17-4-4-10-7-18-7s-14 3-18 7Z"
        }
        fill={config.hair}
      />
      {variant === "offers" ? (
        <path d="M23 28c4-8 10-12 17-12 8 0 14 4 17 12-5-2-11-3-17-3s-12 1-17 3Z" fill={config.hair} />
      ) : null}
      <circle cx="34" cy="35" r="2" fill="#111827" />
      <circle cx="46" cy="35" r="2" fill="#111827" />
      <path d="M40 37v6" stroke="#9a6a52" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34 46c2 2 4 3 6 3s4-1 6-3" stroke="#9a3412" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function AIEmployeeCard({
  name,
  description,
  avatar,
  onUse,
}: AIEmployeeCardProps) {
  return (
    <article className="surface-tile flex h-full flex-col">
      <div className="flex flex-col items-center space-y-4 text-center">
        <AIEmployeeAvatar variant={avatar} />
        <h2 className="text-base font-semibold text-slate-950">{name}</h2>
        <p className="section-copy">{description}</p>
      </div>

      <div className="container-actions mt-auto justify-center">
        <button className="button-primary" type="button" onClick={onUse}>
          Bruk
        </button>
      </div>
    </article>
  );
}
