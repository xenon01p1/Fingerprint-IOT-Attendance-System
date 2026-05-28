/*
  Warnings:

  - You are about to drop the column `deviceId` on the `logdevice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `logdevice` DROP FOREIGN KEY `LogDevice_deviceId_fkey`;

-- DropIndex
DROP INDEX `LogDevice_deviceId_idx` ON `logdevice`;

-- AlterTable
ALTER TABLE `logdevice` DROP COLUMN `deviceId`;
