export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-full" aria-busy="true" aria-label="Loading">
      {/* TopBar placeholder */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6">
        <div className="h-5 w-[3px] rounded-full bg-[var(--color-border)]" />
        <div className="skeleton h-4 w-44" />
      </div>

      {/* Metrics row */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 bg-[var(--color-surface)] p-5">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-7 w-28" />
              <div className="skeleton h-2.5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Content columns */}
      <div className="grid flex-1 gap-5 px-6 pb-8 lg:grid-cols-[300px_1fr_340px]">
        {Array.from({ length: 3 }).map((_, col) => (
          <div
            key={col}
            className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="skeleton h-4 w-32" />
            {Array.from({ length: 4 }).map((_, r) => (
              <div key={r} className="flex items-center gap-3">
                <div className="skeleton h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
