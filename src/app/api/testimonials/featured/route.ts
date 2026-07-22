import { NextResponse } from "next/server";
import { getFeaturedTestimonials } from "@/lib/users";

export async function GET() {
  const testimonials = await getFeaturedTestimonials(6);
  return NextResponse.json(testimonials);
}
