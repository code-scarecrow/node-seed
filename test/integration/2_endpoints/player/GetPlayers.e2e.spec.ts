import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { Player } from 'src/domain/entities/Player';
import { PlayerResponse } from 'src/infrastructure/primary-adapters/http/controllers/player/response/PlayerResponse';
import { expect } from 'chai';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Get Players e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let player1: Player;
	let player2: Player;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		const club = await dbClient.createClub(country.id);
		player1 = await dbClient.createPlayer(club.id, country.id);
		player2 = await dbClient.createPlayer(club.id, country.id);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
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
				expect(structure).to.deep.equals([new PlayerResponse(player1), new PlayerResponse(player2)]);
			});
	});
});
