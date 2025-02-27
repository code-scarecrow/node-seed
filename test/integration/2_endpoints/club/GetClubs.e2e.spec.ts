import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { ClubResponse } from 'src/infrastructure/primary-adapters/http/controllers/club/response/ClubResponse';
import { expect } from 'chai';

describe('Get Clubs e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let club1: ClubEntity;
	let club2: ClubEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = new CountryEntity();
		country.id = 1;
		country.uuid = 'b1681000-df21-4413-b092-b5e67e0e2c5b';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		club1 = new ClubEntity();
		club1.uuid = 'b1681000-df21-4413-b092-b5e67e0e2c5c';
		club1.name = 'Club Atlético Vélez Sarsfield';
		club1.foundationDate = new Date('1910-01-01');
		club1.country = country;

		club2 = new ClubEntity();
		club2.uuid = 'b1681000-df21-4413-b092-b5e67e0e2c5d';
		club2.name = 'Club Atlético Tucumán';
		club2.foundationDate = new Date('1902-09-27');
		club2.country = country;

		await insert<ClubEntity>(datasource, [club1, club2]);
	});

	afterEach(async () => {
		await deleteAll(datasource, ClubEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all clubs.', async () => {
		await request(server)
			.get('/api/v1.0/clubs')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).deep.equals([new ClubResponse(club1), new ClubResponse(club2)]);
			});
	});
});
