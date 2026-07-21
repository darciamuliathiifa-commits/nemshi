import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getAllUsersForAdmin } from "@/lib/admin-users";

export async function GET(request: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const usersList = await getAllUsersForAdmin(query);
  return NextResponse.json(usersList);
}
