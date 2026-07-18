-- CreateTable
CREATE TABLE "daily_closings" (
    "id" TEXT NOT NULL PRIMARY KEY
        CHECK (
            length("id") = 36
            AND substr("id", 9, 1) = '-'
            AND substr("id", 14, 1) = '-'
            AND lower(substr("id", 15, 1)) = '7'
            AND substr("id", 19, 1) = '-'
            AND lower(substr("id", 20, 1)) IN ('8', '9', 'a', 'b')
            AND substr("id", 24, 1) = '-'
            AND lower("id") NOT GLOB '*[^0-9a-f-]*'
        ),
    "user_id" TEXT NOT NULL,
    "operational_date" TEXT NOT NULL
        CHECK (length("operational_date") = 10 AND date("operational_date") = "operational_date"),
    "uber_earnings_cents" INTEGER NOT NULL CHECK ("uber_earnings_cents" >= 0),
    "ninety_nine_earnings_cents" INTEGER NOT NULL CHECK ("ninety_nine_earnings_cents" >= 0),
    "fuel_expense_cents" INTEGER NOT NULL CHECK ("fuel_expense_cents" >= 0),
    "food_expense_cents" INTEGER NOT NULL CHECK ("food_expense_cents" >= 0),
    "parking_expense_cents" INTEGER NOT NULL CHECK ("parking_expense_cents" >= 0),
    "toll_expense_cents" INTEGER NOT NULL CHECK ("toll_expense_cents" >= 0),
    "maintenance_expense_cents" INTEGER NOT NULL CHECK ("maintenance_expense_cents" >= 0),
    "other_expenses_cents" INTEGER NOT NULL CHECK ("other_expenses_cents" >= 0),
    "initial_odometer_meters" INTEGER NOT NULL CHECK ("initial_odometer_meters" >= 0),
    "final_odometer_meters" INTEGER NOT NULL
        CHECK ("final_odometer_meters" >= "initial_odometer_meters"),
    "worked_seconds" INTEGER NOT NULL CHECK ("worked_seconds" >= 0),
    "notes" TEXT CHECK ("notes" IS NULL OR length("notes") <= 2000),
    "created_at" DATETIME NOT NULL CHECK ("created_at" GLOB '????-??-??T??:??:??*+00:00'),
    "updated_at" DATETIME NOT NULL CHECK ("updated_at" GLOB '????-??-??T??:??:??*+00:00'),
    CONSTRAINT "daily_closings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "local_users" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_closings_user_date_key" ON "daily_closings"("user_id", "operational_date");

-- CreateIndex
CREATE INDEX "daily_closings_user_date_idx" ON "daily_closings"("user_id", "operational_date" DESC);
