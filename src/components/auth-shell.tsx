export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-b from-surface-tint to-white px-4 py-12 sm:px-6">
      <div className="rounded-3xl w-full max-w-sm border border-black/5 bg-white p-7 shadow-lg shadow-black/5">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            N
          </span>
          <h1 className="mt-3 text-xl font-bold text-text">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        </div>
        {children}
      </div>
    </main>
  );
}
