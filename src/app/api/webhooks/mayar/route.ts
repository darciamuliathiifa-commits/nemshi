import { NextResponse } from "next/server";
import { verifyAndMarkMayarPayment } from "@/lib/orders";
import type { MayarPaymentReceivedPayload } from "@/lib/mayar";

/**
 * Penerima webhook Mayar. Daftarkan URL ini secara manual di dashboard
 * Mayar (Integration -> Webhook). Tidak ada sesi/login di sini karena ini
 * dipanggil langsung oleh server Mayar — keasliannya diverifikasi lewat
 * verifyAndMarkMayarPayment() (cross-check ke Get History Mayar), bukan
 * lewat signature header (Mayar tidak mendokumentasikannya).
 */
export async function POST(request: Request) {
  const payload = (await request.json()) as MayarPaymentReceivedPayload;

  if (payload.event !== "payment.received") {
    // Event lain (payment.reminder, membership.*, shipper.status, dsb.)
    // belum relevan untuk Nemshi — cukup di-ack.
    return NextResponse.json({ received: true });
  }

  try {
    await verifyAndMarkMayarPayment(payload);
  } catch (error) {
    console.error("Gagal memproses webhook Mayar:", error);
    // Tetap balas 200 agar Mayar tidak retry tanpa henti untuk kegagalan
    // yang kemungkinan permanen (order tidak ditemukan, verifikasi gagal).
    return NextResponse.json(
      { received: true, error: error instanceof Error ? error.message : "unknown error" },
      { status: 200 }
    );
  }

  return NextResponse.json({ received: true });
}
