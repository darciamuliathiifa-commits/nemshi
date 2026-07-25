export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 h-6 w-48 animate-pulse rounded bg-surface" />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-card border border-border-subtle bg-surface" />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-card border border-border-subtle bg-surface" />
        ))}
      </div>
    </main>
  );
}
