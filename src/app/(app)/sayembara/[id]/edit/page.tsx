import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parsePriceLabel } from "@/lib/format-currency";
import { EditSayembaraForm } from "@/components/sayembara/edit-sayembara-form";
import type { AdCategory } from "@/lib/types";

export default async function EditSayembaraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data } = await supabase
    .from("sayembara")
    .select("id, owner_id, title, description, category, location, price_label, wa_nego")
    .eq("id", id)
    .maybeSingle();

  if (!data || data.owner_id !== user.id) {
    notFound();
  }

  const { currency, amount } = parsePriceLabel(data.price_label);

  return (
    <>
      <Header title="Edit Sayembara" containerClassName="max-w-xl" />

      <main className="flex-1 px-6 py-8">
        <Link
          href={`/sayembara/${data.id}`}
          className="mb-6 inline-flex items-center text-[14px] font-bold text-cta hover:text-highlight"
        >
          ← Kembali ke Detail Sayembara
        </Link>

        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-charcoal">Edit Sayembara</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Perbarui detail sayembaramu.
          </p>

          <EditSayembaraForm
            id={data.id}
            initialValues={{
              title: data.title,
              description: data.description,
              category: data.category as AdCategory,
              location: data.location ?? "",
              priceAmount: amount,
              currency,
              waNego: data.wa_nego,
            }}
          />
        </div>
      </main>
    </>
  );
}
