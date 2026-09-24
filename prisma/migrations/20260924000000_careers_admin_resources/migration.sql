CREATE TABLE IF NOT EXISTS "jobs" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "workplace_type" TEXT NOT NULL,
    "employment_type" TEXT NOT NULL,
    "compensation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "application_open" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "require_resume" BOOLEAN NOT NULL DEFAULT true,
    "require_address" BOOLEAN NOT NULL DEFAULT false,
    "require_phone" BOOLEAN NOT NULL DEFAULT false,
    "require_message" BOOLEAN NOT NULL DEFAULT true,
    "collect_hosting_details" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "jobs_status_check" CHECK ("status" IN ('draft', 'published', 'closed', 'archived')),
    CONSTRAINT "jobs_workplace_type_check" CHECK ("workplace_type" IN ('remote', 'hybrid', 'on-site'))
);

CREATE UNIQUE INDEX IF NOT EXISTS "jobs_slug_key" ON "jobs"("slug");
CREATE INDEX IF NOT EXISTS "jobs_status_application_open_display_order_idx" ON "jobs"("status", "application_open", "display_order");

INSERT INTO "jobs" (
    "id", "title", "slug", "team", "summary", "description", "responsibilities", "requirements",
    "location", "workplace_type", "employment_type", "compensation", "status", "application_open",
    "display_order", "require_resume", "require_address", "require_phone", "require_message",
    "collect_hosting_details", "published_at"
) VALUES (
    '00000000-0000-4000-8000-000000000001',
    'U.S.-Based Hosting Equipment Manager',
    'us-hosting-equipment-manager',
    'Operations',
    'A reliable, long-term technical support partner helping us expand our U.S. hosting network.',
    'Wonderhow began operations in the Philippines and has since expanded into the U.S. market. We are looking for someone dependable and technically capable who can securely host company-owned equipment, support authorized remote access, and step in with hands-on help when needed.',
    'Receive and securely set up company-provided laptops and related hosting equipment.\nConnect each device to stable, reliable internet.\nKeep equipment powered on, connected, secure, and accessible for authorized remote management.\nMonitor equipment and report connectivity, power, or hardware issues.\nProvide hands-on troubleshooting when an issue cannot be resolved remotely.\nRespond to urgent issues, ideally within one to two hours.',
    'You are physically located in the United States.\nYou have a secure location for company equipment.\nYou have reliable electricity and high-speed internet.\nYou understand laptops, networking, routers, remote-access tools, and basic troubleshooting.\nYou communicate clearly and can offer dependable availability.',
    'United States', 'remote', 'Contract', '$100 setup per laptop; $200 monthly hosting per laptop',
    'published', true, 0, false, true, true, false, true, CURRENT_TIMESTAMP
) ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "job_id" UUID;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "job_title_snapshot" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consented_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "consent_version" TEXT NOT NULL DEFAULT '2026-09';
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "archived_at" TIMESTAMPTZ(6);

UPDATE "applications"
SET "job_id" = '00000000-0000-4000-8000-000000000001',
    "job_title_snapshot" = "role";

ALTER TABLE "applications" ALTER COLUMN "job_id" SET NOT NULL;
ALTER TABLE "applications" ALTER COLUMN "job_title_snapshot" SET NOT NULL;
ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "applications_status_check";
UPDATE "applications" SET "status" = 'reviewing' WHERE "status" = 'read';
ALTER TABLE "applications" ADD CONSTRAINT "applications_status_check"
CHECK ("status" IN ('unread', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired', 'archived'));
ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "applications_job_id_fkey";
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_fkey"
FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX IF NOT EXISTS "applications_job_id_status_idx" ON "applications"("job_id", "status");

CREATE TABLE IF NOT EXISTS "application_notes" (
    "id" UUID NOT NULL,
    "application_id" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "created_by" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "application_notes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "application_notes_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "application_notes_application_id_created_at_idx" ON "application_notes"("application_id", "created_at");

CREATE TABLE IF NOT EXISTS "resource_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resource_types_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resource_types_status_check" CHECK ("status" IN ('active', 'archived'))
);
CREATE UNIQUE INDEX IF NOT EXISTS "resource_types_slug_key" ON "resource_types"("slug");
CREATE INDEX IF NOT EXISTS "resource_types_status_display_order_idx" ON "resource_types"("status", "display_order");

CREATE TABLE IF NOT EXISTS "resources" (
    "id" UUID NOT NULL,
    "resource_type_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "external_url" TEXT,
    "cover_image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "resources_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "resources_status_check" CHECK ("status" IN ('draft', 'published', 'archived')),
    CONSTRAINT "resources_resource_type_id_fkey" FOREIGN KEY ("resource_type_id") REFERENCES "resource_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "resources_slug_key" ON "resources"("slug");
CREATE INDEX IF NOT EXISTS "resources_resource_type_id_status_display_order_idx" ON "resources"("resource_type_id", "status", "display_order");
