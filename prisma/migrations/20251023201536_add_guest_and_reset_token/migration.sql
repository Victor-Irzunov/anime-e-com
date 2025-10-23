/*
  Warnings:

  - You are about to drop the column `discount` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `shipping` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpires` on the `User` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `OrderData_status_idx` ON `OrderData`;

-- DropIndex
DROP INDEX `OrderData_userId_idx` ON `OrderData`;

-- AlterTable
ALTER TABLE `OrderData` DROP COLUMN `discount`,
    DROP COLUMN `email`,
    DROP COLUMN `shipping`,
    DROP COLUMN `status`,
    DROP COLUMN `total`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `passwordResetExpires`,
    ADD COLUMN `passwordResetTokenExp` DATETIME(3) NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;
