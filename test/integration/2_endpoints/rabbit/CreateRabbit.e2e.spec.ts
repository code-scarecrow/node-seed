import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';

describe('Create Rabbits e2e Test.', () => {
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

	it('Create new rabbit', async () => {
		return request(server)
			.post('/api/v1.0/rabbits')
			.send({
				name: 'test',
				age: 0,
				race: 'American',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(201);
	});

	it('Create new rabbit without name', async () => {
		return request(server)
			.post('/api/v1.0/rabbits')
			.send({
				age: 0,
				race: 'American',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(400);
	});
});
