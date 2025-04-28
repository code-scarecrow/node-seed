import { HttpServer, INestApplication } from '@nestjs/common';
import { initiateApp } from '../../infrastructure/app/AppInitiator';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { expect } from 'chai';
import { IUserIncommingMessage } from 'src/infrastructure/primary-adapters/message-queue/listeners/user/IUserIncommingMessage';
import { RabbitMessage, safeGetConfig } from '@code-scarecrow/base';
import { Channel, Connection, connect } from 'amqplib';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Process user create message.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let queue: string;
	let connection: Connection;
	let channel: Channel;

	const user = new UserEntity();
	user.uuid = '40fa3986-c9c1-4575-8385-6fe5f4d6fafb';
	user.name = 'Walter';
	user.lastname = 'Bou';
	user.dni = '32415234';
	user.birthDate = new Date('1993-08-25');
	user.email = 'walter@bou.com';
	user.password = 'qwerqwrsdf';

	const messageBody: IUserIncommingMessage = {
		uuid: '40fa3986-c9c1-4575-8385-6fe5f4d6fafb',
		name: 'Walter',
		lastname: 'Bou',
		dni: '32415234',
		birthDate: new Date('1993-08-25'),
		email: 'walter@bou.com',
		password: 'qwerqwrsdf',
	};

	const message = new RabbitMessage(messageBody, '2314123412qweddfasdf', 'ms-seed');

	before(async () => {
		app = await initiateApp();
		connection = await connect(safeGetConfig('RABBIT_URI'));
		queue = safeGetConfig('RABBIT_QUEUE');
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		channel = await connection.createChannel();
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
		await channel.close();
	});

	after(async () => {
		await app.close();
		await connection.close();
	});

	it('Create User.', async () => {
		//Arrange
		channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

		//Act
		await new Promise((r) => setTimeout(r, 10));

		//Assert
		const userCreated = await dbClient.getUserByEmail(messageBody.email);
		expect(userCreated).instanceOf(UserEntity);
		expect(userCreated?.name).equal(messageBody.name);
		expect(userCreated?.lastname).equal(messageBody.lastname);
		expect(userCreated?.dni).equal(messageBody.dni);
		expect(userCreated?.birthDate.toISOString()).equal(messageBody.birthDate.toISOString());
		expect(userCreated?.email).equal(messageBody.email);
	});
});
