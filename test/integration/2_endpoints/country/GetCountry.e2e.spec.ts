import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { expect } from 'chai';

describe('Get Country e2e Test.', () => {
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

	it('Get an existent country.', async () => {
		await request(server)
			.get(`/api/v1.0/countries/${country.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('code')).to.be.true;
			});
	});

	it('Get an inexistent country.', async () => {
		await request(server)
			.get('/api/v1.0/countries/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.NOT_FOUND)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00002')).to.be.true;
				expect(structure.includes(new EntityNotFound('Country').message)).to.be.true;
			});
	});

	it('Get a country with bad uuid param', async () => {
		await request(server)
			.get('/api/v1.0/countries/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
