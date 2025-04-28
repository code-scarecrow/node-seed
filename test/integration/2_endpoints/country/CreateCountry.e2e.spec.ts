import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryRequest } from 'src/infrastructure/primary-adapters/http/controllers/country/request/CountryRequest';
import { dbClient } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { expect } from 'chai';

describe('Create Country e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;

	const countryRequest = new CountryRequest();
	countryRequest.code = 'ARG';
	countryRequest.name = 'Argentina';

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(() => {
		server = app.getHttpServer();
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Create new country.', async () => {
		await request(server)
			.post('/api/v1.0/countries')
			.send(countryRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('code')).to.be.true;
			});
	});

	it('Create new country without name.', async () => {
		await request(server)
			.post('/api/v1.0/countries')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
