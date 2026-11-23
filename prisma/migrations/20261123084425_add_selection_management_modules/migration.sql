-- CreateTable
CREATE TABLE `academic_year` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `status` ENUM('UPCOMING', 'ACTIVE', 'COMPLETED') NOT NULL DEFAULT 'UPCOMING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academic_year_name_key`(`name`),
    INDEX `academic_year_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_group` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `student_group_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `selection_period` (
    `id` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `studentGroupId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('REGULAR', 'ADDITIONAL', 'SPECIAL') NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'UPCOMING', 'OPEN', 'CLOSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `preferenceStartDate` DATETIME(3) NULL,
    `preferenceEndDate` DATETIME(3) NULL,
    `latePreferenceStartDate` DATETIME(3) NULL,
    `latePreferenceEndDate` DATETIME(3) NULL,
    `reconsiderationStartDate` DATETIME(3) NULL,
    `reconsiderationEndDate` DATETIME(3) NULL,
    `maxPreferences` INTEGER NOT NULL DEFAULT 3,
    `maxPreferenceUpdates` INTEGER NOT NULL DEFAULT 3,
    `requiredGpaStage` ENUM('FIRST_COLLECTION', 'SECOND_COLLECTION') NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `selection_period_academicYearId_status_idx`(`academicYearId`, `status`),
    INDEX `selection_period_studentGroupId_idx`(`studentGroupId`),
    INDEX `selection_period_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_selection_config` (
    `id` VARCHAR(191) NOT NULL,
    `selectionPeriodId` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `proposedCapacity` INTEGER NOT NULL,
    `approvedCapacity` INTEGER NULL,
    `femaleQuotaPercentage` DECIMAL(5, 2) NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `proposedBy` VARCHAR(191) NOT NULL,
    `approvedBy` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `department_selection_config_status_idx`(`status`),
    UNIQUE INDEX `department_selection_config_selectionPeriodId_departmentId_key`(`selectionPeriodId`, `departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_selection_config_revision` (
    `id` VARCHAR(191) NOT NULL,
    `configId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `proposedCapacity` INTEGER NOT NULL,
    `approvedCapacity` INTEGER NULL,
    `femaleQuotaPercentage` DECIMAL(5, 2) NOT NULL,
    `eligibilitySnapshot` JSON NOT NULL,
    `reason` VARCHAR(191) NULL,
    `changedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `department_selection_config_revision_changedBy_idx`(`changedBy`),
    UNIQUE INDEX `department_selection_config_revision_configId_version_key`(`configId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_eligibility_requirement` (
    `id` VARCHAR(191) NOT NULL,
    `configId` VARCHAR(191) NOT NULL,
    `requirementGroup` VARCHAR(191) NOT NULL,
    `qualificationType` ENUM('DIPLOMA', 'LEVEL_IV', 'OTHER') NOT NULL,
    `fieldOfStudy` VARCHAR(191) NULL,
    `matchingRule` ENUM('EXACT', 'RELATED', 'ANY') NOT NULL,
    `isMandatory` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `department_eligibility_requirement_configId_idx`(`configId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_academic_record` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `semester` ENUM('FIRST_SEMESTER', 'SECOND_SEMESTER') NOT NULL,
    `semesterGPA` DECIMAL(4, 2) NOT NULL,
    `recordedBy` VARCHAR(191) NOT NULL,
    `recordedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `student_academic_record_academicYearId_semester_idx`(`academicYearId`, `semester`),
    INDEX `student_academic_record_recordedBy_idx`(`recordedBy`),
    UNIQUE INDEX `student_academic_record_studentId_academicYearId_semester_key`(`studentId`, `academicYearId`, `semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_academic_record_correction` (
    `id` VARCHAR(191) NOT NULL,
    `academicRecordId` VARCHAR(191) NOT NULL,
    `oldGPA` DECIMAL(4, 2) NOT NULL,
    `newGPA` DECIMAL(4, 2) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `correctedBy` VARCHAR(191) NOT NULL,
    `correctedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `student_academic_record_correction_academicRecordId_idx`(`academicRecordId`),
    INDEX `student_academic_record_correction_correctedBy_idx`(`correctedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_qualification` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `qualificationType` ENUM('DIPLOMA', 'LEVEL_IV', 'OTHER') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `fieldOfStudy` VARCHAR(191) NULL,
    `institution` VARCHAR(191) NULL,
    `completionYear` INTEGER NULL,
    `documentReference` VARCHAR(191) NULL,
    `verificationStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `verifiedBy` VARCHAR(191) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `student_qualification_studentId_idx`(`studentId`),
    INDEX `student_qualification_verificationStatus_idx`(`verificationStatus`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `selection_period` ADD CONSTRAINT `selection_period_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_year`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selection_period` ADD CONSTRAINT `selection_period_studentGroupId_fkey` FOREIGN KEY (`studentGroupId`) REFERENCES `student_group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `selection_period` ADD CONSTRAINT `selection_period_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config` ADD CONSTRAINT `department_selection_config_selectionPeriodId_fkey` FOREIGN KEY (`selectionPeriodId`) REFERENCES `selection_period`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config` ADD CONSTRAINT `department_selection_config_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config` ADD CONSTRAINT `department_selection_config_proposedBy_fkey` FOREIGN KEY (`proposedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config` ADD CONSTRAINT `department_selection_config_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config_revision` ADD CONSTRAINT `department_selection_config_revision_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `department_selection_config`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_selection_config_revision` ADD CONSTRAINT `department_selection_config_revision_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_eligibility_requirement` ADD CONSTRAINT `department_eligibility_requirement_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `department_selection_config`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_academic_record` ADD CONSTRAINT `student_academic_record_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_academic_record` ADD CONSTRAINT `student_academic_record_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_year`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_academic_record` ADD CONSTRAINT `student_academic_record_recordedBy_fkey` FOREIGN KEY (`recordedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_academic_record_correction` ADD CONSTRAINT `student_academic_record_correction_academicRecordId_fkey` FOREIGN KEY (`academicRecordId`) REFERENCES `student_academic_record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_academic_record_correction` ADD CONSTRAINT `student_academic_record_correction_correctedBy_fkey` FOREIGN KEY (`correctedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_qualification` ADD CONSTRAINT `student_qualification_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `student_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_qualification` ADD CONSTRAINT `student_qualification_verifiedBy_fkey` FOREIGN KEY (`verifiedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
