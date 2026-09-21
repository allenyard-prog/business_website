ALTER TABLE "applications" RENAME COLUMN "city_state" TO "full_address";

ALTER TABLE "applications" ADD COLUMN "phone" TEXT;
