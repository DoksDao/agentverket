interface StatCardProps {
  label: string;
  value: string;
  change: string;
}

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <article className="h-full rounded-xl border border-slate-200 bg-white p-5">
      <p className="meta-label">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{change}</p>
    </article>
  );
}

interface EmployeeCardProps {
  name: string;
  description: string;
  status: string;
  metricLabel: string;
  metricValue: string;
}

export function EmployeeCard({
  name,
  description,
  status,
  metricLabel,
  metricValue,
}: EmployeeCardProps) {
  return (
    <article className="surface-tile flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="section-title">{name}</h3>
          <p className="section-copy mt-1">{status}</p>
        </div>
        <span className="text-xs font-medium text-slate-500">
          AI
        </span>
      </div>
      <p className="section-copy mt-4">{description}</p>
      <div className="mt-5">
        <p className="meta-label">
          {metricLabel}
        </p>
        <p className="metric-value mt-2">{metricValue}</p>
      </div>
    </article>
  );
}

interface ActivityListItemProps {
  title: string;
  description: string;
  time: string;
}

export function ActivityListItem({
  title,
  description,
  time,
}: ActivityListItemProps) {
  return (
    <article className="surface-tile-muted flex gap-4 last:border-b">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
      <div className="min-w-0">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="section-title">{title}</h3>
          <p className="meta-label">
            {time}
          </p>
        </div>
        <p className="section-copy mt-2">{description}</p>
      </div>
    </article>
  );
}
