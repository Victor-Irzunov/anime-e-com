/*
  Warnings:

  - A unique constraint covering the columns `[passwordResetToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `OrderData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderData` ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `shipping` JSON NULL,
    ADD COLUMN `status` ENUM('NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'NOT_PICKED') NOT NULL DEFAULT 'NEW',
    ADD COLUMN `total` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isGuest` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetToken` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `OrderData_userId_idx` ON `OrderData`(`userId`);

-- CreateIndex
CREATE INDEX `OrderData_status_idx` ON `OrderData`(`status`);

-- CreateIndex
CREATE UNIQUE INDEX `User_passwordResetToken_key` ON `User`(`passwordResetToken`);
