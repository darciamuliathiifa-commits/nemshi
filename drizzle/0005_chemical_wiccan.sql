CREATE TYPE "public"."user_role" AS ENUM('Pelanggan', 'Penyedia_Jasa');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'Pelanggan' NOT NULL;