import { MigrationInterface, QueryRunner } from 'typeorm';

export class msSeedRest1674054272038 implements MigrationInterface {
	public name = 'msSeedRest1674054272038';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'CREATE TABLE `world_cups` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `pet_name` varchar(30) NOT NULL, `start_date` datetime NOT NULL, `finish_date` datetime NOT NULL, `year` varchar(4) NOT NULL, `location_id` int NULL, UNIQUE INDEX `IDX_0bc4311f454b9dc93061abc801` (`year`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			"CREATE TABLE `players` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `name` varchar(30) NOT NULL, `lastname` varchar(100) NOT NULL, `birth_date` datetime NOT NULL, `position` enum ('Goalkeeper', 'Center Back', 'Right Back', 'Left Back', 'Center Midfielder', 'Right Midfielder', 'Left Midfielder', 'Center Forward', 'Right Striker', 'Left Striker') NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `club_id` int NULL, `country_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
		);
		await queryRunner.query(
			'CREATE TABLE `countries` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `name` varchar(50) NOT NULL, `code` varchar(3) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			'CREATE TABLE `clubs` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `name` varchar(30) NOT NULL, `foundation_date` datetime NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `country_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			'CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `name` varchar(30) NOT NULL, `lastname` varchar(100) NOT NULL, `dni` varchar(9) NOT NULL, `email` varchar(100) NOT NULL, `passsword` varchar(255) NOT NULL, `birth_date` datetime NOT NULL, UNIQUE INDEX `IDX_5fe9cfa518b76c96518a206b35` (`dni`), UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			'CREATE TABLE `participants` (`world_cup_id` int NOT NULL, `country_id` int NOT NULL, INDEX `IDX_05348aecc98d38ef425f6bf208` (`world_cup_id`), INDEX `IDX_2001eb8bf2efc13a0600945d85` (`country_id`), PRIMARY KEY (`world_cup_id`, `country_id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			'CREATE TABLE `players_world_cups_world_cups` (`players_id` int NOT NULL, `world_cups_id` int NOT NULL, INDEX `IDX_274bbdd97b988abeba8672eb31` (`players_id`), INDEX `IDX_117669872eddf19db30fe48bf1` (`world_cups_id`), PRIMARY KEY (`players_id`, `world_cups_id`)) ENGINE=InnoDB',
		);
		await queryRunner.query(
			'ALTER TABLE `world_cups` ADD CONSTRAINT `FK_cfb52d32a5c7f1db18d206c6c73` FOREIGN KEY (`location_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE `players` ADD CONSTRAINT `FK_a5426cbe2c827e9ec511b3d00a5` FOREIGN KEY (`club_id`) REFERENCES `clubs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE `players` ADD CONSTRAINT `FK_10144db7fe6b16a4a5fda0ecac8` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE `clubs` ADD CONSTRAINT `FK_283195e110f22a64ef20318791c` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
		await queryRunner.query(
			'ALTER TABLE `participants` ADD CONSTRAINT `FK_05348aecc98d38ef425f6bf2088` FOREIGN KEY (`world_cup_id`) REFERENCES `world_cups`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE `participants` ADD CONSTRAINT `FK_2001eb8bf2efc13a0600945d858` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE `players_world_cups_world_cups` ADD CONSTRAINT `FK_274bbdd97b988abeba8672eb314` FOREIGN KEY (`players_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
		);
		await queryRunner.query(
			'ALTER TABLE `players_world_cups_world_cups` ADD CONSTRAINT `FK_117669872eddf19db30fe48bf14` FOREIGN KEY (`world_cups_id`) REFERENCES `world_cups`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE `players_world_cups_world_cups` DROP FOREIGN KEY `FK_117669872eddf19db30fe48bf14`',
		);
		await queryRunner.query(
			'ALTER TABLE `players_world_cups_world_cups` DROP FOREIGN KEY `FK_274bbdd97b988abeba8672eb314`',
		);
		await queryRunner.query('ALTER TABLE `participants` DROP FOREIGN KEY `FK_2001eb8bf2efc13a0600945d858`');
		await queryRunner.query('ALTER TABLE `participants` DROP FOREIGN KEY `FK_05348aecc98d38ef425f6bf2088`');
		await queryRunner.query('ALTER TABLE `clubs` DROP FOREIGN KEY `FK_283195e110f22a64ef20318791c`');
		await queryRunner.query('ALTER TABLE `players` DROP FOREIGN KEY `FK_10144db7fe6b16a4a5fda0ecac8`');
		await queryRunner.query('ALTER TABLE `players` DROP FOREIGN KEY `FK_a5426cbe2c827e9ec511b3d00a5`');
		await queryRunner.query('ALTER TABLE `world_cups` DROP FOREIGN KEY `FK_cfb52d32a5c7f1db18d206c6c73`');
		await queryRunner.query('DROP INDEX `IDX_117669872eddf19db30fe48bf1` ON `players_world_cups_world_cups`');
		await queryRunner.query('DROP INDEX `IDX_274bbdd97b988abeba8672eb31` ON `players_world_cups_world_cups`');
		await queryRunner.query('DROP TABLE `players_world_cups_world_cups`');
		await queryRunner.query('DROP INDEX `IDX_2001eb8bf2efc13a0600945d85` ON `participants`');
		await queryRunner.query('DROP INDEX `IDX_05348aecc98d38ef425f6bf208` ON `participants`');
		await queryRunner.query('DROP TABLE `participants`');
		await queryRunner.query('DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`');
		await queryRunner.query('DROP INDEX `IDX_5fe9cfa518b76c96518a206b35` ON `users`');
		await queryRunner.query('DROP TABLE `users`');
		await queryRunner.query('DROP TABLE `clubs`');
		await queryRunner.query('DROP TABLE `countries`');
		await queryRunner.query('DROP TABLE `players`');
		await queryRunner.query('DROP INDEX `IDX_0bc4311f454b9dc93061abc801` ON `world_cups`');
		await queryRunner.query('DROP TABLE `world_cups`');
	}
}
