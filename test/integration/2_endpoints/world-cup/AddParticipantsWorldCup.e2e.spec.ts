import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { AddParticipantsRequest } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/request/AddParticipantsRequest';
import { AddParticipantsResponse } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/response/AddParticipantsResponse';
import { expect } from 'chai';

describe('Add Participants to a World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let participantsRequest: AddParticipantsRequest;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const host = new CountryEntity();
		host.id = 1;
		host.uuid = '2a47a932-a7c5-45c7-b02e-7ea0aab42529';
		host.code = 'ARG';
		host.name = 'Argentina';

		const participant1 = new CountryEntity();
		participant1.id = 2;
		participant1.uuid = '2a47a932-a7c5-45c7-b02e-7ea0aab42530';
		participant1.code = 'ARG';
		participant1.name = 'Argentina';

		const participant2 = new CountryEntity();
		participant2.id = 3;
		participant2.uuid = '2a47a932-a7c5-45c7-b02e-7ea0aab42531';
		participant2.code = 'BRA';
		participant2.name = 'Brazil';

		await insert<CountryEntity>(datasource, [host, participant1, participant2]);

		worldCup = new WorldCupEntity();
		worldCup.uuid = '2a47a932-a7c5-45c7-b02e-7ea0aab42532';
		worldCup.petName = "La'eeb";
		worldCup.year = '2022';
		worldCup.startDate = new Date('2022-11-20');
		worldCup.finishDate = new Date('2022-12-18');
		worldCup.location = host;

		await insert<WorldCupEntity>(datasource, [worldCup]);

		participantsRequest = new AddParticipantsRequest();
		participantsRequest.participants = [participant1.uuid, participant2.uuid];
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

	it('Add participants an existent world cup.', async () => {
		await request(server)
			.post(`/api/v1.0/world-cups/${worldCup.uuid}/participants`)
			.send(participantsRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.ACCEPTED))
			.expect((res) => {
				expect(res.body).deep.equal(new AddParticipantsResponse());
			});
	});

	it('Add participant to an existent world cup with bad request.', async () => {
		await request(server)
			.post(`/api/v1.0/world-cups/${worldCup.uuid}/participants`)
			.send({ participants: [1, '67d7c4fc-02f4-49ce-befd-3fbd08e6ac42'] })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});

	it('Add participant to a world cup with bad uuid param.', async () => {
		await request(server)
			.post('/api/v1.0/world-cups/1/participants')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
