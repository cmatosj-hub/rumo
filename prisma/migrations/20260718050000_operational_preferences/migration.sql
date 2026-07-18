-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN "weekly_goal_cents" INTEGER
    CHECK ("weekly_goal_cents" IS NULL OR "weekly_goal_cents" > 0);
ALTER TABLE "user_settings" ADD COLUMN "monthly_goal_cents" INTEGER
    CHECK ("monthly_goal_cents" IS NULL OR "monthly_goal_cents" > 0);
ALTER TABLE "user_settings" ADD COLUMN "minimum_hourly_rate_cents" INTEGER
    CHECK ("minimum_hourly_rate_cents" IS NULL OR "minimum_hourly_rate_cents" > 0);
ALTER TABLE "user_settings" ADD COLUMN "week_starts_on" INTEGER NOT NULL DEFAULT 1
    CHECK ("week_starts_on" BETWEEN 1 AND 7);
