/*
  Warnings:

  - A unique constraint covering the columns `[titleLink]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Brand_name_key` ON `Brand`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `h1` VARCHAR(255) NULL,
    ADD COLUMN `metaDesc` VARCHAR(512) NULL,
    ADD COLUMN `metaTitle` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_titleLink_key` ON `Product`(`titleLink`);

-- CreateIndex
CREATE INDEX `Product_categoryId_idx` ON `Product`(`categoryId`);

-- CreateIndex
CREATE INDEX `Product_subCategoryId_idx` ON `Product`(`subCategoryId`);

-- CreateIndex
CREATE INDEX `Product_brandId_idx` ON `Product`(`brandId`);

-- CreateIndex
CREATE INDEX `SubCategory_categoryId_idx` ON `SubCategory`(`categoryId`);
