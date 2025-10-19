-- AlterTable
ALTER TABLE `Product` ADD COLUMN `banner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `discounts` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `povsednevnaya` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `recommended` BOOLEAN NOT NULL DEFAULT false;
