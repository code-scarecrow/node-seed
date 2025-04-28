import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryRequest } from 'src/infrastructure/primary-adapters/http/controllers/country/request/CountryRequest';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { expect } from 'chai';

describe('Update Country e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let country: CountryEntity;

	const countryRequest = new CountryRequest();
	countryRequest.code = 'ARG';
	countryRequest.name = 'Argentina';

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

	it('Update an existent country.', async () => {
		await request(server)
			.put(`/api/v1.0/countries/${country.uuid}`)
			.send(countryRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('code')).to.be.true;
			});

		const countryExistent = await dbClient.getCountryByUuid(country.uuid);
		expect(countryExistent).equal;
		expect(countryExistent?.code).equal(countryRequest.code);
		expect(countryExistent?.name).equal(countryRequest.name);
	});

	it('Update an existent country without name.', async () => {
		await request(server)
			.put(`/api/v1.0/countries/${country.uuid}`)
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});

	it('Update a country with bad uuid param.', async () => {
		await request(server)
			.put('/api/v1.0/countries/1')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
