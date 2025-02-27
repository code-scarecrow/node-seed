import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { CountryResponse } from 'src/infrastructure/primary-adapters/http/controllers/country/response/CountryResponse';
import { expect } from 'chai';

describe('Get Countries e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let country1: CountryEntity;
	let country2: CountryEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		country1 = new CountryEntity();
		country1.uuid = '0b5ccea9-85e5-438c-b60d-3fd36eeb1ba7';
		country1.code = 'ARG';
		country1.name = 'Argentina';
		country2 = new CountryEntity();
		country2.uuid = '0b5ccea9-85e5-438c-b60d-3fd36eeb1ba8';
		country2.code = 'BRA';
		country2.name = 'Brazil';
		await insert<CountryEntity>(datasource, [country1, country2]);
	});

	afterEach(async () => {
		await deleteAll(datasource, CountryEntity);
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
