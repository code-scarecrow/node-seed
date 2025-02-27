import { HttpServer, INestApplication } from '@nestjs/common';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';

describe('Update Rabbits e2e Test.', () => {
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

	it('Update a rabbit', async () => {
		return request(server)
			.put('/api/v1.0/rabbits/test')
			.send({
				name: 'test',
				age: 0,
				race: 'American',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(200);
	});

	it('Update a rabbit without name', async () => {
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
