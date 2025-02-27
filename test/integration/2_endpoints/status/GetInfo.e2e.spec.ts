import { HttpServer, INestApplication } from '@nestjs/common';
import { safeGetConfig } from '@code-scarecrow/base';
import { expect } from 'chai';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { version, seedVersion } from 'package.json';

describe('Get Info e2e Test.', () => {
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

	it('Get ms info.', async () => {
		await request(server)
			.get('/api/v1.0/info')
			.send()
			.expect((r) => {
				expect(r.body.name).to.be.equal(safeGetConfig('APP_NAME'));
				expect(r.body.version).to.be.equal(version);
				expect(r.body.seedVersion).to.be.equal(seedVersion);
			});
	});
});
