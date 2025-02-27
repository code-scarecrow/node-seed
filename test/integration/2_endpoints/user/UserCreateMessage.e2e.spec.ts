import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { deleteAll, findOneBy } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { DataSource } from 'typeorm';
import { expect } from 'chai';
import { UserRequest } from 'src/infrastructure/primary-adapters/http/controllers/user/request/UserRequest';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { Channel, Connection, connect } from 'amqplib';
import { safeGetConfig } from '@code-scarecrow/base';

describe('Send Create User Message e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let userRequest: UserRequest;
	let queue: string;
	let connection: Connection;
	let channel: Channel;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
		connection = await connect(safeGetConfig('RABBIT_URI'));
		queue = safeGetConfig('RABBIT_QUEUE');
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		channel = await connection.createChannel();

		userRequest = new UserRequest();
		userRequest.name = 'Walter';
		userRequest.lastname = 'Bou';
		userRequest.dni = '32415234';
		userRequest.birthDate = '1993-08-25';
		userRequest.email = 'walter@bou.com';
		userRequest.password = 'qwerqwrsdf';
	});

	afterEach(async () => {
		await deleteAll(datasource, UserEntity);
		await server.close();
		await channel.close();
	});

	after(async () => {
		await app.close();
		await connection.close();
	});

	it('Send create user message.', async () => {
		await request(server)
			.post('/api/v1.0/users')
			.send(userRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED));

		await Promise.resolve(process.nextTick(() => {}));

		while ((await channel.assertQueue(queue)).messageCount !== 0) {
			await new Promise((r) => setTimeout(r, 10));
		}

		const userCreated = await findOneBy<UserEntity>(datasource, UserEntity, {
			email: userRequest.email,
		});
		expect(userCreated).equal;
		expect(userCreated?.name).equal(userRequest.name);
		expect(userCreated?.lastname).equal(userRequest.lastname);
		expect(userCreated?.dni).equal(userRequest.dni);
		expect(userCreated?.birthDate).deep.equal(new Date(userRequest.birthDate));
		expect(userCreated?.email).equal(userRequest.email);
	});

	it('Send create user message without name.', async () => {
		await request(server)
			.post('/api/v1.0/users')
			.send({
				lastname: 'Bou',
				dni: '32415234',
				birthDate: '1993-08-25',
				email: 'walter@bou.com',
				password: 'qwerqwrsdf',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
