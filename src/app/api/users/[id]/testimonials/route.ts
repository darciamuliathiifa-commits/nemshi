import { NextRequest, NextResponse } from "next/server";
import { createTestimonial, getUserTestimonials } from "@/lib/users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const testimonials = await getUserTestimonials(id);
  return NextResponse.json(testimonials);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const reviewerName = typeof body.reviewerName === "string" ? body.reviewerName.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  const rating = Number(body.rating);

  if (!reviewerName) {
    return NextResponse.json({ error: "Nama pemberi testimoni wajib diisi" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating harus antara 1 sampai 5" }, { status: 400 });
  }
  if (comment.length < 10) {
    return NextResponse.json(
      { error: "Ulasan minimal 10 karakter" },
      { status: 400 }
    );
  }

  const testimonial = await createTestimonial(id, { reviewerName, rating, comment });
  return NextResponse.json(testimonial, { status: 201 });
}
