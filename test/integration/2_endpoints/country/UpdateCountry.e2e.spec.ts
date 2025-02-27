import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryRequest } from 'src/infrastructure/primary-adapters/http/controllers/country/request/CountryRequest';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, findOneBy, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { expect } from 'chai';

describe('Update Country e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let country: CountryEntity;

	const countryRequest = new CountryRequest();
	countryRequest.code = 'ARG';
	countryRequest.name = 'Argentina';

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		country = new CountryEntity();
		country.uuid = '0685cee3-5fc8-4b88-ab4d-6647045d5f4d';
		country.code = 'BRA';
		country.name = 'Brazil';

		await insert<CountryEntity>(datasource, [country]);
	});

	afterEach(async () => {
		await deleteAll(datasource, CountryEntity);
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

		const countryExistent = await findOneBy<CountryEntity>(datasource, CountryEntity, {
			uuid: country.uuid,
		});
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
