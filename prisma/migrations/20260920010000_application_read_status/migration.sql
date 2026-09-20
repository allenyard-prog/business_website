ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'unread';

UPDATE "applications" SET "status" = 'unread' WHERE "status" = 'new';

ALTER TABLE "applications"
ADD CONSTRAINT "applications_status_check"
CHECK ("status" IN ('unread', 'read'));
