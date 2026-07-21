import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { updateCategory } from "@/lib/admin-categories";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const updated = await updateCategory(id, {
    name: typeof body.name === "string" ? body.name : undefined,
    icon: typeof body.icon === "string" ? body.icon : undefined,
    isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
  });

  await logAdminActivity({
    adminUserId,
    action: "update_category",
    targetType: "category",
    targetId: id,
  });

  return NextResponse.json(updated);
}
