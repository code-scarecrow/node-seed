/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `players` will be added. If there are existing duplicate values, this will fail.
  - Made the column `country_id` on table `clubs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `club_id` on table `players` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country_id` on table `players` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `clubs` DROP FOREIGN KEY `FK_283195e110f22a64ef20318791c`;

-- DropForeignKey
ALTER TABLE `players` DROP FOREIGN KEY `FK_10144db7fe6b16a4a5fda0ecac8`;

-- DropForeignKey
ALTER TABLE `players` DROP FOREIGN KEY `FK_a5426cbe2c827e9ec511b3d00a5`;

-- AlterTable
ALTER TABLE `clubs` MODIFY `country_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `players` MODIFY `club_id` INTEGER NOT NULL,
    MODIFY `country_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `players_uuid_key` ON `players`(`uuid`);

-- AddForeignKey
ALTER TABLE `clubs` ADD CONSTRAINT `FK_283195e110f22a64ef20318791c` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `FK_10144db7fe6b16a4a5fda0ecac8` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `FK_a5426cbe2c827e9ec511b3d00a5` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
