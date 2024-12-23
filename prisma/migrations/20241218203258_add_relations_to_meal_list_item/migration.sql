/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpires` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `unity` on the `MealListItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerAccountId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unityId` to the `MealListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropIndex
DROP INDEX `Account_providerId_provider_account_id_key` ON `Account`;

-- DropIndex
DROP INDEX `providerId_providerAccountId` ON `Account`;

-- AlterTable
ALTER TABLE `Account` DROP COLUMN `accessToken`,
    DROP COLUMN `accessTokenExpires`,
    DROP COLUMN `providerId`,
    DROP COLUMN `providerType`,
    DROP COLUMN `provider_account_id`,
    DROP COLUMN `refreshToken`,
    ADD COLUMN `access_token` TEXT NULL,
    ADD COLUMN `expires_at` INTEGER NULL,
    ADD COLUMN `id_token` TEXT NULL,
    ADD COLUMN `provider` VARCHAR(191) NOT NULL,
    ADD COLUMN `providerAccountId` VARCHAR(191) NOT NULL,
    ADD COLUMN `refresh_token` TEXT NULL,
    ADD COLUMN `scope` VARCHAR(191) NULL,
    ADD COLUMN `session_state` VARCHAR(191) NULL,
    ADD COLUMN `token_type` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `MealListItem` DROP COLUMN `unity`,
    ADD COLUMN `unityId` VARCHAR(191) NOT NULL,
    MODIFY `foodId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `hashedPassword` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `VerificationRequest` ADD COLUMN `purpose` ENUM('EMAIL_VERIFICATION', 'PASSWORD_RESET') NULL DEFAULT 'EMAIL_VERIFICATION';

-- CreateIndex
CREATE UNIQUE INDEX `Account_provider_providerAccountId_key` ON `Account`(`provider`, `providerAccountId`);

-- CreateIndex
CREATE INDEX `MealListItem_foodId_fkey` ON `MealListItem`(`foodId`);

-- CreateIndex
CREATE INDEX `MealListItem_unityId_fkey` ON `MealListItem`(`unityId`);

-- AddForeignKey
ALTER TABLE `MealListItem` ADD CONSTRAINT `MealListItem_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `Food`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealListItem` ADD CONSTRAINT `MealListItem_unityId_fkey` FOREIGN KEY (`unityId`) REFERENCES `Unity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
