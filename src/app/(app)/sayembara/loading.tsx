export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="h-[180px] w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface sm:h-[220px]" />

      <div className="mb-4 mt-8 h-4 w-32 animate-pulse rounded bg-surface" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-56 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface"
          />
        ))}
      </div>
    </main>
  );
}
