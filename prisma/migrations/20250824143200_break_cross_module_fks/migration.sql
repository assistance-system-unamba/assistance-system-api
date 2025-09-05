-- CreateTable
CREATE TABLE `event` (
    `event_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `start_time` DATETIME(3) NULL,
    `end_time` DATETIME(3) NULL,
    `place` VARCHAR(60) NULL,
    `create_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material` (
    `material_id` VARCHAR(36) NOT NULL,
    `material_url` TEXT NULL,
    `title` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `type` VARCHAR(45) NULL,
    `create_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `event_id` VARCHAR(36) NOT NULL,

    INDEX `fk_material_event_idx`(`event_id`),
    PRIMARY KEY (`material_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_data` (
    `personal_data_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NULL,
    `last_name` VARCHAR(90) NULL,
    `dni` CHAR(8) NULL,
    `date_birth` DATE NULL,
    `email` VARCHAR(80) NULL,
    `cell_phone` VARCHAR(12) NULL,

    PRIMARY KEY (`personal_data_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participant` (
    `participant_id` VARCHAR(36) NOT NULL,
    `faculty` VARCHAR(45) NULL,
    `career` VARCHAR(90) NULL,
    `type` ENUM('participant', 'speaker', 'teacher') NULL,
    `personal_data_id` VARCHAR(36) NOT NULL,
    `event_id` VARCHAR(36) NOT NULL,

    INDEX `fk_participant_personal_data1_idx`(`personal_data_id`),
    PRIMARY KEY (`participant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` INTEGER NULL,
    `user_name` VARCHAR(45) NULL,
    `password` VARCHAR(80) NULL,
    `card_number` VARCHAR(80) NULL,
    `participant_id` VARCHAR(36) NOT NULL,

    INDEX `fk_user_participant1_idx`(`participant_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(36) NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `is_revoked` BOOLEAN NOT NULL DEFAULT false,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `fk_refresh_token_user_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fingerprint_reader` (
    `fingerprint_reader_id` VARCHAR(36) NOT NULL,
    `ip` VARCHAR(45) NULL,
    `device_series` VARCHAR(50) NULL,
    `name` VARCHAR(45) NULL,
    `port` VARCHAR(5) NULL,
    `location` VARCHAR(90) NULL,

    PRIMARY KEY (`fingerprint_reader_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_log` (
    `log_id` VARCHAR(36) NOT NULL,
    `timestamp` DATETIME(3) NULL,
    `status` VARCHAR(10) NULL,
    `create_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fingerprint_reader_id` VARCHAR(36) NOT NULL,
    `participant_id` VARCHAR(36) NOT NULL,

    INDEX `fk_asistencia_fingerprint_reader1_idx`(`fingerprint_reader_id`),
    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `material` ADD CONSTRAINT `material_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event`(`event_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participant` ADD CONSTRAINT `participant_personal_data_id_fkey` FOREIGN KEY (`personal_data_id`) REFERENCES `personal_data`(`personal_data_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant`(`participant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_log` ADD CONSTRAINT `attendance_log_fingerprint_reader_id_fkey` FOREIGN KEY (`fingerprint_reader_id`) REFERENCES `fingerprint_reader`(`fingerprint_reader_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
