import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials, users } from "@/db/schema";

export async function getAllTestimonialsForAdmin() {
  return db
    .select({
      id: testimonials.id,
      reviewerName: testimonials.reviewerName,
      rating: testimonials.rating,
      comment: testimonials.comment,
      isHidden: testimonials.isHidden,
      createdAt: testimonials.createdAt,
      revieweeUserId: testimonials.revieweeUserId,
      revieweeName: users.fullName,
    })
    .from(testimonials)
    .innerJoin(users, eq(testimonials.revieweeUserId, users.id))
    .orderBy(desc(testimonials.createdAt));
}

export async function setTestimonialHidden(testimonialId: string, isHidden: boolean) {
  const [updated] = await db
    .update(testimonials)
    .set({ isHidden })
    .where(eq(testimonials.id, testimonialId))
    .returning();

  return updated;
}

export async function deleteTestimonial(testimonialId: string) {
  await db.delete(testimonials).where(eq(testimonials.id, testimonialId));
}
