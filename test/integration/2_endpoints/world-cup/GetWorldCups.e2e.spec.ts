import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { WorldCupResponse } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/response/WorldCupResponse';
import { expect } from 'chai';

describe('Get World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let worldCup1: WorldCupEntity;
	let worldCup2: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const host1 = new CountryEntity();
		host1.id = 1;
		host1.uuid = '40d3a971-eb9d-4ac3-a0c2-4c8f31640339';
		host1.code = 'ARG';
		host1.name = 'Argentina';

		const host2 = new CountryEntity();
		host2.id = 2;
		host2.uuid = '40d3a971-eb9d-4ac3-a0c2-4c8f31640340';
		host2.code = 'QAT';
		host2.name = 'Qatar';

		await insert<CountryEntity>(datasource, [host1, host2]);

		worldCup1 = new WorldCupEntity();
		worldCup1.uuid = '40d3a971-eb9d-4ac3-a0c2-4c8f31640341';
		worldCup1.petName = 'Gauchito';
		worldCup1.year = '1978';
		worldCup1.startDate = new Date('1978-06-01');
		worldCup1.finishDate = new Date('1978-06-25');
		worldCup1.location = host1;

		worldCup2 = new WorldCupEntity();
		worldCup2.uuid = '40d3a971-eb9d-4ac3-a0c2-4c8f31640342';
		worldCup2.petName = "La'eeb";
		worldCup2.year = '2022';
		worldCup2.startDate = new Date('2022-11-20');
		worldCup2.finishDate = new Date('2022-12-18');
		worldCup2.location = host2;

		await insert<WorldCupEntity>(datasource, [worldCup1, worldCup2]);
	});

	afterEach(async () => {
		await deleteAll(datasource, WorldCupEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all world cups.', async () => {
		await request(server)
			.get('/api/v1.0/world-cups')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).to.deep.equals(
					[new WorldCupResponse(worldCup1), new WorldCupResponse(worldCup2)].map((worldCup) => {
						delete worldCup.participants;
						return worldCup;
					}),
				);
			});
	});
});
