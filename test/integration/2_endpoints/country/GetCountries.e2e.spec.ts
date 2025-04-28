import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { Country } from 'src/domain/entities/Country';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { CountryResponse } from 'src/infrastructure/primary-adapters/http/controllers/country/response/CountryResponse';
import { expect } from 'chai';

describe('Get Countries e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let country1: Country;
	let country2: Country;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		country1 = await dbClient.createCountry();
		country2 = await dbClient.createCountry();
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all countries.', async () => {
		await request(server)
			.get('/api/v1.0/countries')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).deep.equal(
					[new CountryResponse(country1), new CountryResponse(country2)].map((i) => {
						delete i.players;
						return i;
					}),
				);
			});
	});
});
