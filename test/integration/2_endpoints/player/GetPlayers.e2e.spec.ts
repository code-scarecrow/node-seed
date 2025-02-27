import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PlayerResponse } from 'src/infrastructure/primary-adapters/http/controllers/player/response/PlayerResponse';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Get Players e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let player1: PlayerEntity;
	let player2: PlayerEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '0b9f0553-4528-42ca-a520-9da2ec9636b9';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		const club = new ClubEntity();
		club.id = 1;
		club.uuid = '0b9f0553-4528-42ca-a520-9da2ec9636b8';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		player1 = new PlayerEntity();
		player1.name = 'Walter';
		player1.lastname = 'Bou';
		player1.birthDate = new Date('1993-08-25');
		player1.position = PositionEnum.CF;
		player1.createdAt = new Date();
		player1.updatedAt = new Date();
		player1.country = country;
		player1.club = club;

		player2 = new PlayerEntity();
		player2.name = 'Lautaro';
		player2.lastname = 'Giannetti';
		player2.birthDate = new Date('1993-11-13');
		player2.position = PositionEnum.CB;
		player2.createdAt = new Date();
		player2.updatedAt = new Date();
		player2.country = country;
		player2.club = club;

		await insert<PlayerEntity>(datasource, [player1, player2]);
	});

	afterEach(async () => {
		await deleteAll(datasource, PlayerEntity);
		await deleteAll(datasource, ClubEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all players.', async () => {
		await request(server)
			.get('/api/v1.0/players')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).to.deep.equals(
					[new PlayerResponse(player1), new PlayerResponse(player2)].map((player) => {
						delete player.club;
						delete player.country;
						return player;
					}),
				);
			});
	});
});
