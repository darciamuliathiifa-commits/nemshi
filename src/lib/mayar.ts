/**
 * Klien API Mayar (payment gateway) — https://docs.mayar.id
 *
 * PENTING: sandbox pengembangan ini tidak bisa menjangkau api.mayar.id /
 * api.mayar.club (diblokir kebijakan jaringan), jadi kode di file ini
 * belum pernah dicoba terhadap API Mayar yang sesungguhnya. Bentuk
 * request/response mengikuti dokumentasi resmi persis, tapi WAJIB
 * diverifikasi ulang di sandbox Mayar (web.mayar.club) sebelum dipakai
 * produksi — lihat catatan di createMayarInvoice() soal ambiguitas
 * bentuk response `data`.
 */

const MAYAR_API_HOST = process.env.MAYAR_API_HOST ?? "https://api.mayar.id";
const MAYAR_API_KEY = process.env.MAYAR_API_KEY;

function requireApiKey(): string {
  if (!MAYAR_API_KEY) {
    throw new Error("MAYAR_API_KEY belum diatur di environment.");
  }
  return MAYAR_API_KEY;
}

/** Respons non-JSON (mis. halaman error 502/504 dari infra Mayar) tidak boleh menjatuhkan server. */
async function parseJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Respons Mayar tidak valid (HTTP ${response.status}): ${text.slice(0, 200)}`);
  }
}

export type MayarInvoiceItem = {
  quantity: number;
  rate: number;
  description: string;
};

export type CreateMayarInvoiceInput = {
  name: string;
  email: string;
  mobile: string;
  redirectUrl: string;
  description: string;
  /** ISO 8601 UTC, mis. new Date(...).toISOString() */
  expiredAt: string;
  items: MayarInvoiceItem[];
  extraData: {
    noCustomer: string;
    idProd: string;
  };
};

export type MayarInvoice = {
  id: string;
  transactionId: string;
  link: string;
  expiredAt: number;
  extraData?: { noCustomer: string; idProd: string };
};

/** POST /hl/v1/invoice/create — https://docs.mayar.id/api-reference/invoice/create */
export async function createMayarInvoice(input: CreateMayarInvoiceInput): Promise<MayarInvoice> {
  const apiKey = requireApiKey();

  const response = await fetch(`${MAYAR_API_HOST}/hl/v1/invoice/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      typeof body?.messages === "string"
        ? body.messages
        : `Gagal membuat invoice Mayar (HTTP ${response.status}).`
    );
  }

  // Dokumentasi Mayar melabeli `data` sebagai "array of object" tapi juga
  // langsung mendaftar field-nya seakan objek tunggal — tangani dua-duanya
  // sampai bentuk asli dikonfirmasi lewat sandbox Mayar.
  const data = Array.isArray(body.data) ? body.data[0] : body.data;

  if (!data?.link || !data?.transactionId) {
    throw new Error("Respons Mayar tidak berisi link/transactionId invoice yang diharapkan.");
  }

  return data as MayarInvoice;
}

export type MayarWebhookHistoryEntry = {
  id: string;
  createdAt: number;
  paymentLinkId: string;
  /** JSON string — payload asli yang dikirim ke webhook kita */
  payload: string;
  status: string;
  type: string;
  updatedAt: number;
  userId: string;
  paymentLinkTransactionId: string;
  urlDestination: string;
  responsePayload: string | null;
  source: string;
};

/**
 * GET /hl/v2/webhooks/history — dipakai untuk cross-check keaslian
 * notifikasi webhook (Mayar tidak mendokumentasikan skema signature),
 * bukan sekadar debugging. Lihat verifyMayarPaymentEvent() di orders.ts.
 */
export async function getMayarWebhookHistory(params: {
  type?: string;
  status?: string;
  limit?: number;
}): Promise<MayarWebhookHistoryEntry[]> {
  const apiKey = requireApiKey();

  const query = new URLSearchParams({ limit: String(params.limit ?? 50) });
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);

  const response = await fetch(`${MAYAR_API_HOST}/hl/v2/webhooks/history?${query.toString()}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const body = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      typeof body?.messages === "string"
        ? body.messages
        : `Gagal mengambil riwayat webhook Mayar (HTTP ${response.status}).`
    );
  }

  return Array.isArray(body.data) ? body.data : [];
}

/** Payload webhook payment.received — lihat docs.mayar.id bagian Webhook. */
export type MayarPaymentReceivedPayload = {
  event: "payment.received";
  data: {
    id: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    amount: number;
    productId?: string;
    productName?: string;
    productType?: string;
    [key: string]: unknown;
  };
};
