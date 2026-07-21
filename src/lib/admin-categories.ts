import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function getAllCategoriesForAdmin() {
  return db.select().from(categories).orderBy(categories.name);
}

export async function createCategory(data: { name: string; slug: string; icon: string }) {
  const [category] = await db.insert(categories).values(data).returning();
  return category;
}

export async function updateCategory(
  id: string,
  data: { name?: string; icon?: string; isActive?: boolean }
) {
  const [updated] = await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id))
    .returning();

  return updated;
}
