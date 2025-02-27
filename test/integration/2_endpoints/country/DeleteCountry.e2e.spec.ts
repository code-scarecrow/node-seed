import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, findOneBy, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { expect } from 'chai';

describe('Delete Country e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let country: CountryEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		country = new CountryEntity();
		country.uuid = '0b5ccea9-85e5-438c-b60d-3fd36eeb1ba9';
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

	it('Delete an existent country.', async () => {
		await request(server)
			.delete(`/api/v1.0/countries/${country.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const countryExistent = await findOneBy<CountryEntity>(datasource, CountryEntity, {
			uuid: country.uuid,
		});
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
