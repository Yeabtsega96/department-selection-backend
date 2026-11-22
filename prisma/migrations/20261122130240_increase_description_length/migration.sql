-- AlterTable
ALTER TABLE `campus` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `department` MODIFY `description` TEXT NULL,
    MODIFY `vision` TEXT NULL,
    MODIFY `mission` TEXT NULL,
    MODIFY `objectives` TEXT NULL;
