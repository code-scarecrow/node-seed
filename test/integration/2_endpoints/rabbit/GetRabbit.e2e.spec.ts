import { HttpServer, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { RabbitRepository } from 'src/infrastructure/secondary-adapters/dynamodb/repositories/RabbitRepository';
import { DynamodbClient } from 'src/infrastructure/secondary-adapters/dynamodb/clients/DynamodbClient';
import { RabbitRacesEnum } from 'src/domain/enums/RabbitRaces';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dynamodbConfig } from 'src/infrastructure/secondary-adapters/dynamodb/config/DynamodbConfig';

describe('Get Rabbits e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let rabbit: Rabbit;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		const rabbitRepository = new RabbitRepository(dynamodbConfig(), new DynamodbClient(dynamodbConfig()));

		rabbit = await rabbitRepository.create({
			id: '',
			name: 'test',
			age: 0,
			race: RabbitRacesEnum.AMERICAN,
		});
		server = app.getHttpServer();
	});

	afterEach(async () => {
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get a rabbit', async () => {
		return request(server)
			.get(`/api/v1.0/rabbits/${rabbit.id}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(200);
	});

	it('Rabbit not found', async () => {
		return request(server).get('/api/v1.0/rabbits/55').send().set('Country-Code', CountryCodeEnum.AR).expect(404);
	});
});
