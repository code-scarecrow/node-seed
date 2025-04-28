import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { expect } from 'chai';
import { Redis } from 'ioredis';
import { safeGetConfig } from '@code-scarecrow/base';

describe('Get Club e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let club: ClubEntity;
	let redisClient: Redis;

	before(async () => {
		app = await initiateApp();
		redisClient = new Redis({
			host: safeGetConfig('REDIS_HOST'),
			port: Number(safeGetConfig('REDIS_PORT')),
		});
	});

	beforeEach(async () => {
		await redisClient.flushdb();
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		club = await dbClient.createClub(country.id);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
		await redisClient.quit();
	});

	it('Get an existent club.', async () => {
		await request(server)
			.get(`/api/v1.0/clubs/${club.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('foundationDate')).to.be.true;
				expect(structure.includes('country')).to.be.true;
			});
	});

	it('Get an existent club from cache.', async () => {
		await redisClient.set('club-' + club.uuid, JSON.stringify(club));

		await request(server)
			.get(`/api/v1.0/clubs/${club.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('foundationDate')).to.be.true;
				expect(structure.includes('country')).to.be.true;
			});
	});

	it('Get an inexistent club.', async () => {
		await request(server)
			.get('/api/v1.0/clubs/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.NOT_FOUND)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00002')).to.be.true;
				expect(structure.includes(new EntityNotFound('Club').message)).to.be.true;
			});
	});

	it('Get a club with bad uuid param', async () => {
		await request(server)
			.get('/api/v1.0/clubs/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
