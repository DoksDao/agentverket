interface AIEmployeeCardProps {
  name: string;
  role: string;
  description: string;
  tasks: string[];
}

export function AIEmployeeCard({
  name,
  role,
  description,
  tasks,
}: AIEmployeeCardProps) {
  return (
    <article className="surface-tile flex h-full flex-col">
      <div className="container-header">
        <div className="container-meta">
          <p className="meta-label">{role}</p>
          <span className="text-xs font-medium text-slate-500">Klar</span>
        </div>
        <h2 className="section-title">{name}</h2>
        <p className="section-copy">{description}</p>
      </div>
      <div className="container-content">
        <h3 className="meta-label">
          Kan utføre
        </h3>
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li key={task} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-actions">
        <button className="button-primary">
          Bruk
        </button>
      </div>
    </article>
  );
}
