CREATE TYPE "public"."fund_status" AS ENUM('Ditahan', 'Dirilis', 'Dikembalikan');--> statement-breakpoint
CREATE TYPE "public"."order_product_type" AS ENUM('Iklan_Tawarkan_Jasa', 'Cari_Jasa_Prioritas', 'Paket_Plus', 'Traktir_Platform');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('Menunggu_Pembayaran', 'Sukses', 'Gagal');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"listing_id" uuid,
	"product_type" "order_product_type" NOT NULL,
	"amount" integer NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Menunggu_Pembayaran' NOT NULL,
	"payment_method" text,
	"fund_status" "fund_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
