// Mayar (mayar.id) payment gateway client — invoice creation only.
// Docs: https://docs.mayar.id/api-reference/invoice/create

const MAYAR_API_HOST = process.env.MAYAR_API_HOST || "https://api.mayar.id";
const MAYAR_API_KEY = process.env.MAYAR_API_KEY;

export interface CreateInvoiceInput {
  name: string;
  email: string;
  mobile: string;
  redirectUrl: string;
  description: string;
  expiredAt: string; // ISO 8601
  items: { quantity: number; rate: number; description: string }[];
  extraData?: Record<string, string>;
}

export interface CreateInvoiceResult {
  id: string;
  transactionId: string;
  link: string;
  expiredAt: number;
}

export class MayarNotConfiguredError extends Error {
  constructor() {
    super("MAYAR_API_KEY belum diset.");
    this.name = "MayarNotConfiguredError";
  }
}

export async function createMayarInvoice(
  input: CreateInvoiceInput,
): Promise<CreateInvoiceResult> {
  if (!MAYAR_API_KEY) {
    throw new MayarNotConfiguredError();
  }

  const res = await fetch(`${MAYAR_API_HOST}/hl/v1/invoice/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAYAR_API_KEY}`,
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.data) {
    throw new Error(json?.messages || `Gagal membuat invoice Mayar (status ${res.status}).`);
  }

  return json.data as CreateInvoiceResult;
}
