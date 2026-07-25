export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-surface" />
      <div className="mb-6 h-6 w-64 animate-pulse rounded bg-surface" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 w-full animate-pulse rounded-card border border-border-subtle bg-surface"
          />
        ))}
      </div>
    </main>
  );
}
