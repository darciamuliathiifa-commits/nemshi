import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, reports, users } from "@/db/schema";

export type ReportReason =
  | "Penipuan"
  | "Informasi_Palsu"
  | "Spam"
  | "Konten_Tidak_Pantas"
  | "Lainnya";

export async function createReport(
  reporterUserId: string,
  listingId: string,
  reason: ReportReason,
  description?: string
) {
  const [report] = await db
    .insert(reports)
    .values({
      reporterUserId,
      listingId,
      reason,
      description: description?.trim() || null,
    })
    .returning();

  return report;
}

export async function getAllReportsForAdmin() {
  return db
    .select({
      id: reports.id,
      reason: reports.reason,
      description: reports.description,
      status: reports.status,
      createdAt: reports.createdAt,
      reviewedAt: reports.reviewedAt,
      listingId: listings.id,
      listingTitle: listings.title,
      listingStatus: listings.status,
      listingOwnerId: users.id,
      listingOwnerName: users.fullName,
      listingOwnerSuspended: users.isSuspended,
      reporterUserId: reports.reporterUserId,
    })
    .from(reports)
    .innerJoin(listings, eq(reports.listingId, listings.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .orderBy(desc(reports.createdAt));
}

export async function markReportReviewed(reportId: string) {
  const [updated] = await db
    .update(reports)
    .set({ status: "Ditinjau", reviewedAt: new Date() })
    .where(eq(reports.id, reportId))
    .returning();

  if (!updated) throw new Error("Laporan tidak ditemukan.");

  return updated;
}
