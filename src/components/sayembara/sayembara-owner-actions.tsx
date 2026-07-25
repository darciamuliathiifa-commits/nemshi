"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SayembaraOwnerActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        "Yakin mau hapus sayembara ini? Tindakan ini tidak bisa dibatalkan.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/sayembara/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menghapus sayembara.");
      }
      router.push("/iklan-saya");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus sayembara.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/sayembara/${id}/edit`}
        className="flex h-9 flex-1 items-center justify-center rounded-pill border-2 border-ink text-[13px] font-bold text-charcoal transition-colors hover:bg-surface"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="flex h-9 flex-1 items-center justify-center rounded-pill border-2 border-error text-[13px] font-bold text-error transition-colors hover:bg-error/10 disabled:opacity-60"
      >
        {deleting ? "Menghapus..." : "Hapus"}
      </button>
    </div>
  );
}
