import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { expect } from 'chai';

describe('Delete Club e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let clubUuid: string;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		const club = await dbClient.createClub(country.id);
		clubUuid = club.uuid;
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Delete an existent club.', async () => {
		await request(server)
			.delete(`/api/v1.0/clubs/${clubUuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const clubExistent = await dbClient.getClubByUuid(clubUuid);
		expect(clubExistent).equal(null);
	});

	it('Delete a club with bad uuid param.', async () => {
		await request(server)
			.delete('/api/v1.0/clubs/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
