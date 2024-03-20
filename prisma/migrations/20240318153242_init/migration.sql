/*
  Warnings:

  - You are about to drop the column `isDone` on the `todos` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `todos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todos` DROP COLUMN `isDone`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('OnProggres', 'Completed') NOT NULL DEFAULT 'OnProggres',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `dueDate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
