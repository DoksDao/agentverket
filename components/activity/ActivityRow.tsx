interface ActivityRowProps {
  taskName: string;
  aiEmployee: string;
  time: string;
  status: string;
  details: string;
}

const statusStyles: Record<string, string> = {
  Fullført:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  Feilet: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
};

export function ActivityRow({
  taskName,
  aiEmployee,
  time,
  status,
  details,
}: ActivityRowProps) {
  return (
    <article className="surface-tile-muted transition">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_0.9fr_0.7fr_0.7fr] lg:items-center">
        <div>
          <p className="section-title">{taskName}</p>
          <p className="section-copy mt-1 lg:hidden">
            {details}
          </p>
        </div>

        <div>
          <p className="meta-label lg:hidden">
            AI-ansatt
          </p>
          <p className="text-sm text-slate-700">{aiEmployee}</p>
        </div>

        <div>
          <p className="meta-label lg:hidden">
            Tidspunkt
          </p>
          <p className="text-sm text-slate-700">{time}</p>
        </div>

        <div>
          <p className="meta-label lg:hidden">
            Status
          </p>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p className="section-copy hidden max-w-sm lg:block">
            {details}
          </p>
          <button className="text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-700">
            Se detaljer
          </button>
        </div>
      </div>
    </article>
  );
}
