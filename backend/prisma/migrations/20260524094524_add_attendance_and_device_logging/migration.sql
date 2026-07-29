ALTER TABLE `Fingerprint` DROP FOREIGN KEY `Fingerprint_deviceId_fkey`;

ALTER TABLE `Fingerprint` DROP FOREIGN KEY `Fingerprint_employeeId_fkey`;

DROP INDEX `Fingerprint_deviceId_fkey` ON `Fingerprint`;

DROP INDEX `Fingerprint_employeeId_fkey` ON `Fingerprint`;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('checkIn', 'checkOut') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `employeeId` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NULL,

    INDEX `Attendance_employeeId_idx`(`employeeId`),
    INDEX `Attendance_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogDevice` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('register', 'finishRegister', 'checkIn', 'checkOut', 'delete') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fingerprintId` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,

    INDEX `LogDevice_deviceId_idx`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fingerprint` ADD CONSTRAINT `Fingerprint_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fingerprint` ADD CONSTRAINT `Fingerprint_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogDevice` ADD CONSTRAINT `LogDevice_fingerprintId_fkey` FOREIGN KEY (`fingerprintId`) REFERENCES `Fingerprint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogDevice` ADD CONSTRAINT `LogDevice_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
