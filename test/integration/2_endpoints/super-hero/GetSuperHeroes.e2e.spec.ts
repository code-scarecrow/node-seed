import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import MockAdapter from 'axios-mock-adapter';
import { SuperHero } from 'src/domain/entities/SuperHero';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { SuperHeroClient } from 'src/infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';
import { expect } from 'chai';

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

	it('Get super heroes', async () => {
		const sh1 = new SuperHero(1, 'test', '50', '50', '50', '50', '50', '50');
		const sh2 = new SuperHero(2, 'test', '50', '50', '50', '50', '50', '50');

		const superHeroes = [sh1, sh2];

		axiosAdapter.onGet('http://json-server/super-heroes').reply(200, superHeroes);

		await request(server)
			.get('/api/v1.0/super-heroes')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(200)
			.expect((res) => {
				const structure = Object.values(res.body);

				expect(structure).deep.equals(superHeroes);
			});
	});
});
