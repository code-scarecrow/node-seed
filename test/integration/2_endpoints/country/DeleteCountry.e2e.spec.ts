import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { expect } from 'chai';

describe('Delete Country e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let country: CountryEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		country = await dbClient.createCountry();
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Delete an existent country.', async () => {
		await request(server)
			.delete(`/api/v1.0/countries/${country.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const countryExistent = await dbClient.getCountryByUuid(country.uuid);
		expect(countryExistent).equal(null);
	});

	it('Delete a country with bad uuid param.', async () => {
		await request(server)
			.delete('/api/v1.0/countries/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
