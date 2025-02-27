import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { expect } from 'chai';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { UserResponse } from 'src/infrastructure/primary-adapters/http/controllers/user/response/UserResponse';

describe('Get Users e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let user1: UserEntity;
	let user2: UserEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		user1 = new UserEntity();
		user1.uuid = '81dd237f-2781-4a98-994a-615798674a0b';
		user1.name = 'Walter';
		user1.lastname = 'Bou';
		user1.dni = '32984192';
		user1.birthDate = new Date('1993-08-25');
		user1.email = 'walter@bou.com';
		user1.password = 'asdadfasfasdas';

		user2 = new UserEntity();
		user2.uuid = 'b4a25a0b-71be-4cef-b44d-1155db19c9e8';
		user2.name = 'Lautaro';
		user2.lastname = 'Giannetti';
		user2.dni = '32653123';
		user2.birthDate = new Date('1993-11-13');
		user2.email = 'lautaro@giannetti.com';
		user2.password = 'asdadfasfasdas';

		await insert<UserEntity>(datasource, [user1, user2]);
	});

	afterEach(async () => {
		await deleteAll(datasource, UserEntity);
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
