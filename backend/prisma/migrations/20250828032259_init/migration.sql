/*
  Warnings:

  - You are about to drop the column `endDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `evId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `isFree` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the `EV` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stationId,number]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stationId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Station` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('FREE', 'OCCUPIED', 'OUT_OF_SERVICE');

-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'COMPLETED';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_evId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_stationId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endDate",
DROP COLUMN "evId",
DROP COLUMN "startDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slotTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stationId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "urgent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "isFree",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "totalSlots" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "EV";

-- CreateIndex
CREATE UNIQUE INDEX "Slot_stationId_number_key" ON "Slot"("stationId", "number");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
