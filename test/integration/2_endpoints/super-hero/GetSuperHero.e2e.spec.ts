import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import MockAdapter from 'axios-mock-adapter';
import { SuperHero } from 'src/domain/entities/SuperHero';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { SuperHeroClient } from 'src/infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';

describe('Get Super Hero e2e Test.', () => {
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

	it('Get a super hero', async () => {
		const sh = new SuperHero(1, 'test', '50', '50', '50', '50', '50', '50');

		axiosAdapter.onGet('http://json-server/super-heroes/1').reply(200, sh);
		return request(server).get('/api/v1.0/super-heroes/1').send().set('Country-Code', CountryCodeEnum.AR).expect(200);
	});

	it('Super hero not found', async () => {
		axiosAdapter.onGet('http://json-server/super-heroes/55').reply(404);
		return request(server)
			.get('/api/v1.0/super-heroes/55')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(404));
	});
});
