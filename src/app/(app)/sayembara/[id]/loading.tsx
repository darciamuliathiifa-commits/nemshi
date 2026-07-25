export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-surface" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="h-80 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />
        <div className="h-56 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />
      </div>
    </main>
  );
}
