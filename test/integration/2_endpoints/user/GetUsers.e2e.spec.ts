import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { expect } from 'chai';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { UserResponse } from 'src/infrastructure/primary-adapters/http/controllers/user/response/UserResponse';

describe('Get Users e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let user1: UserEntity;
	let user2: UserEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		user1 = await dbClient.createUser();
		user2 = await dbClient.createUser();
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get all users.', async () => {
		await request(server)
			.get('/api/v1.0/users')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure).to.deep.equals([new UserResponse(user1), new UserResponse(user2)]);
			});
	});
});
