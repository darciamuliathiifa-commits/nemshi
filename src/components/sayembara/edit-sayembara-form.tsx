"use client";

import { useRouter } from "next/navigation";
import {
  SayembaraForm,
  type SayembaraFormInitialValues,
  type SayembaraFormSubmitValues,
} from "@/components/sayembara/sayembara-form";

export function EditSayembaraForm({
  id,
  initialValues,
}: {
  id: string;
  initialValues: SayembaraFormInitialValues;
}) {
  const router = useRouter();

  async function handleSubmit(values: SayembaraFormSubmitValues) {
    const res = await fetch(`/api/sayembara/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        priceLabel: values.priceLabel,
        waNego: values.waNego,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error ?? "Gagal menyimpan perubahan.");
    }

    router.push(`/sayembara/${id}`);
    router.refresh();
  }

  return (
    <SayembaraForm
      initialValues={initialValues}
      submitLabel="Simpan Perubahan"
      submittingLabel="Menyimpan..."
      onSubmit={handleSubmit}
    />
  );
}
