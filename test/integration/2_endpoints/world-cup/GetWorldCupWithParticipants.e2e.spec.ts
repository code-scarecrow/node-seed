import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Get World cup with participants e2e Test.', () => {
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

		const host = new CountryEntity();
		host.id = 1;
		host.uuid = 'e69fa25d-17a1-4ceb-ae33-062af1b3c14c';
		host.code = 'ARG';
		host.name = 'Argentina';

		const participant = new CountryEntity();
		participant.id = 2;
		participant.uuid = 'e69fa25d-17a1-4ceb-ae33-062af1b3c14d';
		participant.code = 'ARG';
		participant.name = 'Argentina';

		await insert<CountryEntity>(datasource, [host, participant]);

		worldCup = new WorldCupEntity();
		worldCup.uuid = 'e69fa25d-17a1-4ceb-ae33-062af1b3c14e';
		worldCup.petName = "La'eeb";
		worldCup.year = '2022';
		worldCup.startDate = new Date('2022-11-20');
		worldCup.finishDate = new Date('2022-12-18');
		worldCup.location = host;
		worldCup.participants = [host, participant];

		await insert<WorldCupEntity>(datasource, [worldCup]);
	});

	afterEach(async () => {
		await request(server)
			.delete(`/api/v1.0/world-cups/${worldCup.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR);

		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get an existent world cup with participants.', async () => {
		await request(server)
			.get(`/api/v1.0/world-cups/${worldCup.uuid}/participants`)
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
				expect(structure.includes('participants')).to.be.true;
			});
	});

	it('Get an inexistent world cup.', async () => {
		await request(server)
			.get('/api/v1.0/world-cups/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25/participants')
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
			.get('/api/v1.0/world-cups/1/participants')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
