export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-surface" />
      <div className="mx-auto max-w-xl">
        <div className="h-6 w-56 animate-pulse rounded bg-surface" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-surface" />
        <div className="mt-6 h-96 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface" />
      </div>
    </main>
  );
}
