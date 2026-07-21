import { verificationLabel } from "@/lib/format";

export function VerificationBadge({ status }: { status: string }) {
  const label = verificationLabel(status);
  if (!label) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      ✓ {label}
    </span>
  );
}
