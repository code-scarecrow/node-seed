import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { Club } from 'src/domain/entities/Club';
import { ClubResponse } from 'src/infrastructure/primary-adapters/http/controllers/club/response/ClubResponse';
import { expect } from 'chai';
import { dbClient } from 'test/integration/setup';

describe('Get Clubs e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let club1: Club;
	let club2: Club;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		club1 = await dbClient.createClub(country.id);
		club2 = await dbClient.createClub(country.id);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
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
