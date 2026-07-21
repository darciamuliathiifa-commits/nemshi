import { NextRequest, NextResponse } from "next/server";
import { getUserTestimonials } from "@/lib/users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const testimonials = await getUserTestimonials(id);
  return NextResponse.json(testimonials);
}
