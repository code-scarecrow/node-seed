import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';

describe('Delete Rabbits e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(() => {
		server = app.getHttpServer();
	});

	afterEach(async () => {
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Kill a rabbit', async () => {
		return request(server).delete('/api/v1.0/rabbits/test').send().set('Country-Code', CountryCodeEnum.AR).expect(204);
	});
});
