CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city_state" TEXT,
    "internet_provider" TEXT,
    "download_speed" INTEGER,
    "upload_speed" INTEGER,
    "secure_location" TEXT,
    "availability" TEXT,
    "portfolio" TEXT,
    "linkedin" TEXT,
    "message" TEXT,
    "resume_original_name" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'new',

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "applications_received_at_idx" ON "applications"("received_at");
CREATE INDEX "applications_email_idx" ON "applications"("email");
