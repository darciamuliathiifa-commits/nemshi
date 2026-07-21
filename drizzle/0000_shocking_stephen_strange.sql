CREATE TYPE "public"."listing_status" AS ENUM('Pending_Moderation', 'Active', 'Expired', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('Offers_Service', 'Needs_Service');--> statement-breakpoint
CREATE TYPE "public"."quota_type" AS ENUM('Listing_Slot', 'Priority_Slot');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('Unverified', 'Identity_Verified', 'Skill_Verified');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "click_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"clicked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"whatsapp_link" text NOT NULL,
	"status" "listing_status" DEFAULT 'Pending_Moderation' NOT NULL,
	"type" "listing_type" NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"is_priority" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_quotas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quota_type" "quota_type" NOT NULL,
	"remaining_amount" integer DEFAULT 0 NOT NULL,
	"validity_end" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"verification_status" "verification_status" DEFAULT 'Unverified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "click_analytics" ADD CONSTRAINT "click_analytics_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_quotas" ADD CONSTRAINT "user_quotas_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
