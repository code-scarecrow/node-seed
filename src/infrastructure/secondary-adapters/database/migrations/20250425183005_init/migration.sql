-- CreateTable
CREATE TABLE `clubs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `foundation_date` DATETIME(0) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `country_id` INTEGER NULL,

    UNIQUE INDEX `clubs_uuid_key`(`uuid`),
    INDEX `FK_283195e110f22a64ef20318791c`(`country_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `code` VARCHAR(3) NOT NULL,

    UNIQUE INDEX `countries_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participants` (
    `world_cup_id` INTEGER NOT NULL,
    `country_id` INTEGER NOT NULL,

    INDEX `IDX_05348aecc98d38ef425f6bf208`(`world_cup_id`),
    INDEX `IDX_2001eb8bf2efc13a0600945d85`(`country_id`),
    PRIMARY KEY (`world_cup_id`, `country_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `birth_date` DATETIME(0) NOT NULL,
    `position` ENUM('Goalkeeper', 'Center Back', 'Right Back', 'Left Back', 'Center Midfielder', 'Right Midfielder', 'Left Midfielder', 'Center Forward', 'Right Striker', 'Left Striker') NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `club_id` INTEGER NULL,
    `country_id` INTEGER NULL,

    INDEX `FK_10144db7fe6b16a4a5fda0ecac8`(`country_id`),
    INDEX `FK_a5426cbe2c827e9ec511b3d00a5`(`club_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players_world_cups_world_cups` (
    `players_id` INTEGER NOT NULL,
    `world_cups_id` INTEGER NOT NULL,

    INDEX `IDX_117669872eddf19db30fe48bf1`(`world_cups_id`),
    INDEX `IDX_274bbdd97b988abeba8672eb31`(`players_id`),
    PRIMARY KEY (`players_id`, `world_cups_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `dni` VARCHAR(9) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `passsword` VARCHAR(255) NOT NULL,
    `birth_date` DATETIME(0) NOT NULL,

    UNIQUE INDEX `IDX_5fe9cfa518b76c96518a206b35`(`dni`),
    UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `world_cups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `pet_name` VARCHAR(30) NOT NULL,
    `start_date` DATETIME(0) NOT NULL,
    `finish_date` DATETIME(0) NOT NULL,
    `year` VARCHAR(4) NOT NULL,
    `location_id` INTEGER NOT NULL,

    UNIQUE INDEX `world_cups_uuid_key`(`uuid`),
    UNIQUE INDEX `IDX_0bc4311f454b9dc93061abc801`(`year`),
    INDEX `FK_cfb52d32a5c7f1db18d206c6c73`(`location_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clubs` ADD CONSTRAINT `FK_283195e110f22a64ef20318791c` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participants` ADD CONSTRAINT `FK_05348aecc98d38ef425f6bf2088` FOREIGN KEY (`world_cup_id`) REFERENCES `world_cups`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participants` ADD CONSTRAINT `FK_2001eb8bf2efc13a0600945d858` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `FK_10144db7fe6b16a4a5fda0ecac8` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `FK_a5426cbe2c827e9ec511b3d00a5` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players_world_cups_world_cups` ADD CONSTRAINT `FK_117669872eddf19db30fe48bf14` FOREIGN KEY (`world_cups_id`) REFERENCES `world_cups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players_world_cups_world_cups` ADD CONSTRAINT `FK_274bbdd97b988abeba8672eb314` FOREIGN KEY (`players_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `world_cups` ADD CONSTRAINT `FK_cfb52d32a5c7f1db18d206c6c73` FOREIGN KEY (`location_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
