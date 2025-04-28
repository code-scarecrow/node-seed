import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { AddParticipantsRequest } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/request/AddParticipantsRequest';
import { AddParticipantsResponse } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/response/AddParticipantsResponse';
import { expect } from 'chai';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Add Participants to a World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let participantsRequest: AddParticipantsRequest;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const host = await dbClient.createCountry();
		const participant1 = await dbClient.createCountry();
		const participant2 = await dbClient.createCountry();

		worldCup = await dbClient.createWorldCup(host.id, []);

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
