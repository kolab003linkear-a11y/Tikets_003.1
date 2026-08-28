-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StadiumTicketStatus" AS ENUM ('VALID', 'USED', 'EXPIRED');

-- CreateTable
CREATE TABLE "stadiums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "seat_layout" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stadiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stadium_sectors" (
    "id" TEXT NOT NULL,
    "stadium_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "seat_layout" JSONB NOT NULL,

    CONSTRAINT "stadium_sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "stadium_id" TEXT NOT NULL,
    "home_team" TEXT NOT NULL,
    "away_team" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stadium_tickets" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "sector_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "qr_code_hash" TEXT NOT NULL,
    "status" "StadiumTicketStatus" NOT NULL DEFAULT 'VALID',
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stadium_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stadium_sectors_stadium_id_code_key" ON "stadium_sectors"("stadium_id", "code");

-- CreateIndex
CREATE INDEX "matches_start_time_status_idx" ON "matches"("start_time", "status");

-- CreateIndex
CREATE UNIQUE INDEX "matches_stadium_id_start_time_key" ON "matches"("stadium_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "stadium_tickets_qr_code_hash_key" ON "stadium_tickets"("qr_code_hash");

-- CreateIndex
CREATE INDEX "stadium_tickets_match_id_status_idx" ON "stadium_tickets"("match_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "stadium_tickets_match_id_sector_id_seat_number_key" ON "stadium_tickets"("match_id", "sector_id", "seat_number");

-- AddForeignKey
ALTER TABLE "stadium_sectors" ADD CONSTRAINT "stadium_sectors_stadium_id_fkey" FOREIGN KEY ("stadium_id") REFERENCES "stadiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_stadium_id_fkey" FOREIGN KEY ("stadium_id") REFERENCES "stadiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stadium_tickets" ADD CONSTRAINT "stadium_tickets_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stadium_tickets" ADD CONSTRAINT "stadium_tickets_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "stadium_sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stadium_tickets" ADD CONSTRAINT "stadium_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
