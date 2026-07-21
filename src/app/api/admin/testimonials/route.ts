import { NextResponse } from "next/server";
import { getAllTestimonialsForAdmin } from "@/lib/admin-testimonials";

export async function GET() {
  const testimonials = await getAllTestimonialsForAdmin();
  return NextResponse.json(testimonials);
}
