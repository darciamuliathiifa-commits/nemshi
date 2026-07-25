export default function Loading() {
  return (
    <main className="flex-1 px-6 py-10">
      <div className="mb-6 h-4 w-32 animate-pulse rounded bg-surface" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px_1fr] lg:items-start">
        <div className="aspect-[4/5] w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />

        <div className="flex flex-col gap-6">
          <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:p-8">
            <div className="h-7 w-3/4 animate-pulse rounded bg-surface" />
            <div className="mt-3 h-7 w-1/3 animate-pulse rounded bg-surface" />
            <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-surface" />
            <div className="mt-8 h-24 w-full animate-pulse rounded bg-surface" />
          </div>

          <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-surface" />
              <div className="flex-1">
                <div className="h-4 w-32 animate-pulse rounded bg-surface" />
                <div className="mt-2 h-3 w-40 animate-pulse rounded bg-surface" />
              </div>
            </div>
            <div className="mt-5 h-11 w-full animate-pulse rounded-pill bg-surface" />
          </div>
        </div>
      </div>
    </main>
  );
}
