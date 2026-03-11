interface IntegrationCardProps {
  name: string;
  logoText: string;
  logoStyle: string;
  status: "Tilkoblet" | "Ikke tilkoblet";
  description: string;
  actionLabel: "Koble til" | "Administrer";
  compact?: boolean;
}

const statusStyles = {
  Tilkoblet: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  "Ikke tilkoblet": "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export function IntegrationCard({
  name,
  logoText,
  logoStyle,
  status,
  description,
  actionLabel,
  compact = false,
}: IntegrationCardProps) {
  return (
    <article className={`surface-tile flex h-full flex-col transition ${compact ? "p-4" : ""}`}>
      <div className="container-header">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center rounded-lg text-sm font-semibold ${compact ? "h-9 w-9" : "h-10 w-10"} ${logoStyle}`}
            aria-hidden="true"
          >
            {logoText}
          </div>
          <div>
            <h2 className="section-title">
              {name}
            </h2>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>
        </div>
        <p className="section-copy">{description}</p>
      </div>

      <div className="container-actions mt-auto">
        <button
          className={
            actionLabel === "Administrer" ? "button-secondary" : "button-primary"
          }
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
