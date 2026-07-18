-- CreateTable
CREATE TABLE "local_users" (
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
    "name" TEXT NOT NULL CHECK (length(trim("name")) > 0),
    "is_active" BOOLEAN NOT NULL DEFAULT true CHECK ("is_active" IN (0, 1)),
    "created_at" DATETIME NOT NULL CHECK ("created_at" GLOB '????-??-??T??:??:??*+00:00'),
    "updated_at" DATETIME NOT NULL CHECK ("updated_at" GLOB '????-??-??T??:??:??*+00:00')
);

-- CreateTable
CREATE TABLE "user_settings" (
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
    "currency" TEXT NOT NULL DEFAULT 'BRL' CHECK ("currency" = 'BRL'),
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo' CHECK (length(trim("timezone")) > 0),
    "theme" TEXT NOT NULL DEFAULT 'system' CHECK ("theme" IN ('system', 'light', 'dark')),
    "created_at" DATETIME NOT NULL CHECK ("created_at" GLOB '????-??-??T??:??:??*+00:00'),
    "updated_at" DATETIME NOT NULL CHECK ("updated_at" GLOB '????-??-??T??:??:??*+00:00'),
    CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "local_users" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateTable
CREATE TABLE "audit_log" (
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
    "user_id" TEXT,
    "entity" TEXT NOT NULL CHECK (length(trim("entity")) > 0),
    "entity_id" TEXT NOT NULL CHECK (length(trim("entity_id")) > 0),
    "action" TEXT NOT NULL CHECK (length(trim("action")) > 0),
    "actor_type" TEXT NOT NULL CHECK (length(trim("actor_type")) > 0),
    "actor_id" TEXT,
    "occurred_at" DATETIME NOT NULL CHECK ("occurred_at" GLOB '????-??-??T??:??:??*+00:00'),
    "operational_date" TEXT CHECK ("operational_date" IS NULL OR (length("operational_date") = 10 AND date("operational_date") = "operational_date")),
    "previous_values_json" TEXT CHECK (
        "previous_values_json" IS NULL
        OR (
            json_valid("previous_values_json")
            AND json_type("previous_values_json", '$.version') = 'integer'
            AND json_extract("previous_values_json", '$.version') >= 1
        )
    ),
    "next_values_json" TEXT CHECK (
        "next_values_json" IS NULL
        OR (
            json_valid("next_values_json")
            AND json_type("next_values_json", '$.version') = 'integer'
            AND json_extract("next_values_json", '$.version') >= 1
        )
    ),
    "reason" TEXT,
    "correlation_id" TEXT NOT NULL
        CHECK (
            length("correlation_id") = 36
            AND substr("correlation_id", 9, 1) = '-'
            AND substr("correlation_id", 14, 1) = '-'
            AND lower(substr("correlation_id", 15, 1)) = '7'
            AND substr("correlation_id", 19, 1) = '-'
            AND lower(substr("correlation_id", 20, 1)) IN ('8', '9', 'a', 'b')
            AND substr("correlation_id", 24, 1) = '-'
            AND lower("correlation_id") NOT GLOB '*[^0-9a-f-]*'
        ),
    "source" TEXT NOT NULL CHECK (length(trim("source")) > 0),
    "technical_version" INTEGER NOT NULL DEFAULT 1 CHECK ("technical_version" >= 1),
    CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "local_users" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "audit_log_entity_idx" ON "audit_log"("entity", "entity_id", "occurred_at");

-- CreateIndex
CREATE INDEX "audit_log_correlation_id_idx" ON "audit_log"("correlation_id");

-- CreateIndex
CREATE INDEX "audit_log_user_occurred_at_idx" ON "audit_log"("user_id", "occurred_at");

-- ProtectAppendOnly
CREATE TRIGGER "audit_log_reject_update"
BEFORE UPDATE ON "audit_log"
BEGIN
    SELECT RAISE(ABORT, 'AUDIT_APPEND_ONLY');
END;

-- ProtectAppendOnly
CREATE TRIGGER "audit_log_reject_delete"
BEFORE DELETE ON "audit_log"
BEGIN
    SELECT RAISE(ABORT, 'AUDIT_APPEND_ONLY');
END;
