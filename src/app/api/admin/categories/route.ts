import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { createCategory, getAllCategoriesForAdmin } from "@/lib/admin-categories";

export async function GET() {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const categoriesList = await getAllCategoriesForAdmin();
  return NextResponse.json(categoriesList);
}

export async function POST(request: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const icon = typeof body.icon === "string" ? body.icon.trim() : "";

  if (!name || !icon) {
    return NextResponse.json({ error: "Nama dan ikon wajib diisi" }, { status: 400 });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const category = await createCategory({ name, slug, icon });

  await logAdminActivity({
    adminUserId,
    action: "create_category",
    targetType: "category",
    targetId: category.id,
  });

  return NextResponse.json(category, { status: 201 });
}
