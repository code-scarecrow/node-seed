import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import MockAdapter from 'axios-mock-adapter';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { SuperHeroClient } from 'src/infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';

describe('Update Super Hero e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let axiosAdapter: MockAdapter;

	before(async () => {
		app = await initiateApp();
		axiosAdapter = new MockAdapter(app.get(SuperHeroClient).httpClient);
	});

	beforeEach(() => {
		server = app.getHttpServer();
	});

	afterEach(async () => {
		axiosAdapter.reset();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Update a super hero', async () => {
		axiosAdapter.onPut('http://json-server/super-heroes/55').reply(200);

		return request(server)
			.put('/api/v1.0/super-heroes/55')
			.send({
				name: 'test',
				combat: '50',
				durability: '50',
				intelligence: '50',
				power: '50',
				speed: '50',
				strength: '50',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(204));
	});

	it('Update a super hero without name', async () => {
		axiosAdapter.onPut('http://json-server/super-heroes').reply(200);

		return request(server)
			.put('/api/v1.0/super-heroes/55')
			.send({
				combat: '50',
				durability: '50',
				intelligence: '50',
				power: '50',
				speed: '50',
				strength: '50',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(400);
	});
});
