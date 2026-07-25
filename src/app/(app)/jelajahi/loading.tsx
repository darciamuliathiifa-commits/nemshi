export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="h-[180px] w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface sm:h-[220px]" />

      <div className="mt-8 h-40 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />

      <div className="mb-8 mt-8 h-24 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <div className="h-96 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
