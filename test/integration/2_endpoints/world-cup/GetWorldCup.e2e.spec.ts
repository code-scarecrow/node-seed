import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Get World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = new CountryEntity();
		country.id = 1;
		country.uuid = 'df548196-c331-45e5-a4ae-5e557e8aa75c';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		worldCup = new WorldCupEntity();
		worldCup.uuid = 'df548196-c331-45e5-a4ae-5e557e8aa75d';
		worldCup.petName = 'Gauchito';
		worldCup.year = '1978';
		worldCup.startDate = new Date('1978-06-01');
		worldCup.finishDate = new Date('1978-06-25');
		worldCup.location = country;

		await insert<WorldCupEntity>(datasource, [worldCup]);
	});

	afterEach(async () => {
		await deleteAll(datasource, WorldCupEntity);
		await deleteAll(datasource, CountryEntity);
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
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('petName')).to.be.true;
				expect(structure.includes('year')).to.be.true;
				expect(structure.includes('startDate')).to.be.true;
				expect(structure.includes('finishDate')).to.be.true;
				expect(structure.includes('location')).to.be.true;
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
