export interface IntegrationCardProps {
  name: string;
  logoLetter: string;
  logoColor: string;
  status: "Tilkoblet" | "Ikke tilkoblet";
  actionLabel: "Administrer";
  compact?: boolean;
}

const statusStyles = {
  Tilkoblet: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  "Ikke tilkoblet": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export function IntegrationCard({
  name,
  logoLetter,
  logoColor,
  status,
  actionLabel,
  compact = false,
}: IntegrationCardProps) {
  return (
    <article className={`surface-tile transition ${compact ? "p-4" : ""}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" className="h-8 w-8">
              <circle cx="16" cy="16" r="16" fill={logoColor} />
              <text
                x="16"
                y="16"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ffffff"
                fontSize="14"
                fontWeight="700"
                fontFamily="Arial, sans-serif"
              >
                {logoLetter}
              </text>
            </svg>
          </div>
          <div className="min-w-0 sm:flex sm:items-center sm:gap-3">
            <h2 className="section-title">{name}</h2>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium sm:mt-0 ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>
        </div>
        <button className="button-secondary">
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
