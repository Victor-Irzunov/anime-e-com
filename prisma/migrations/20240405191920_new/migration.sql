/*
  Warnings:

  - You are about to drop the column `discountPercentage` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderData` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `OrderData` table. All the data in the column will be lost.
  - Added the required column `orderItems` to the `OrderData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderData` DROP COLUMN `discountPercentage`,
    DROP COLUMN `price`,
    DROP COLUMN `productId`,
    DROP COLUMN `quantity`,
    DROP COLUMN `totalAmount`,
    ADD COLUMN `orderItems` JSON NOT NULL;
