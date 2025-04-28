import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { WorldCupResponse } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/response/WorldCupResponse';
import { expect } from 'chai';

describe('Get World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCup1: WorldCup;
	let worldCup2: WorldCup;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country1 = await dbClient.createCountry();
		worldCup1 = await dbClient.createWorldCup(country1.id, []);

		const country2 = await dbClient.createCountry();
		worldCup2 = await dbClient.createWorldCup(country2.id, []);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all world cups.', async () => {
		await request(server)
			.get('/api/v1.0/world-cups')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).to.deep.equals(
					[new WorldCupResponse(worldCup1), new WorldCupResponse(worldCup2)].map((worldCup) => {
						delete worldCup.participants;
						return worldCup;
					}),
				);
			});
	});
});
