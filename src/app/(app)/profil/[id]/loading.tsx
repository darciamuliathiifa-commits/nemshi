export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="h-24 w-full animate-pulse rounded-card border border-border-subtle bg-surface" />

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-56 w-full animate-pulse rounded-card border-[2.5px] border-ink bg-surface"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
