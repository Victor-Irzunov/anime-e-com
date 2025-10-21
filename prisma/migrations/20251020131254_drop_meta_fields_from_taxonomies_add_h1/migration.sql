/*
  Warnings:

  - You are about to drop the column `metaDesc` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaDesc` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `SubCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Category` DROP COLUMN `metaDesc`,
    DROP COLUMN `metaTitle`;

-- AlterTable
ALTER TABLE `SubCategory` DROP COLUMN `metaDesc`,
    DROP COLUMN `metaTitle`;
