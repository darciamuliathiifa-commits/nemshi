import { NextRequest, NextResponse } from "next/server";
import { deleteTestimonial, setTestimonialHidden } from "@/lib/admin-testimonials";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const updated = await setTestimonialHidden(id, body.isHidden === true);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
