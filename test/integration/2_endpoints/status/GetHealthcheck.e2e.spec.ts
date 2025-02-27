import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';

describe('Get Healthcheck e2e Test.', () => {
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

	it('Get health status.', async () => {
		await request(server).get('/api/v1.0/health-check').send().expect(watch(HttpStatus.OK));
	});
});
