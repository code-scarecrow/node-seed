import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { expect } from 'chai';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Get World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCup: WorldCup;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		worldCup = await dbClient.createWorldCup(country.id, []);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get an existent world cup.', async () => {
		await request(server)
			.get(`/api/v1.0/world-cups/${worldCup.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				//TODO - create a reusable method with native custom messages
				const structure = Object.keys(res.body);
				expect(structure.includes('id'), 'id').to.be.true;
				expect(structure.includes('petName'), 'petName').to.be.true;
				expect(structure.includes('year'), 'year').to.be.true;
				expect(structure.includes('startDate'), 'startDate').to.be.true;
				expect(structure.includes('finishDate'), 'finishDate').to.be.true;
				expect(structure.includes('location'), 'location').to.be.true;
			});
	});

	it('Get an inexistent world cup.', async () => {
		await request(server)
			.get('/api/v1.0/world-cups/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.NOT_FOUND)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00002')).to.be.true;
				expect(structure.includes(new EntityNotFound('WorldCup').message)).to.be.true;
			});
	});

	it('Get a world cup with bad uuid param', async () => {
		await request(server)
			.get('/api/v1.0/world-cups/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
