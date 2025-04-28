import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Get World cup with participants e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const host = await dbClient.createCountry();
		const participant = await dbClient.createCountry();
		worldCup = await dbClient.createWorldCup(host.id, [participant]);
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
