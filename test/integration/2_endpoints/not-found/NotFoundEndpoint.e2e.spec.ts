import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { expect } from 'chai';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';

describe('Not found endpoint e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	const UNEXISTENT_ENDPOINT = 'unexistent-endpoint';

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

	it('should return 404 if endpoint does not exist.', async () => {
		await request(server)
			.get(`/api/v1.0/${UNEXISTENT_ENDPOINT}`)
			.set('Country-Code', CountryCodeEnum.AR)
			.send()
			.expect((res) => {
				expect(res.status).to.equal(HttpStatus.NOT_FOUND);
			});
	});
});
