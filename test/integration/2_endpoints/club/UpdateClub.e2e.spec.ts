import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, findOneWithRelations, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { ClubRequest } from 'src/infrastructure/primary-adapters/http/controllers/club/request/ClubRequest';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { expect } from 'chai';
import { Redis } from 'ioredis';
import { safeGetConfig } from '@code-scarecrow/base';

describe('Update Club e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let clubRequest: ClubRequest;
	let club: ClubEntity;
	let redisClient: Redis;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
		redisClient = new Redis({
			host: safeGetConfig('REDIS_HOST'),
			port: Number(safeGetConfig('REDIS_PORT')),
		});
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '4a93ee3e-5963-466b-bd22-6bebcea6c933';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		club = new ClubEntity();
		club.uuid = '4a93ee3e-5963-466b-bd22-6bebcea6c934';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		clubRequest = new ClubRequest();
		clubRequest.name = 'Club Atlético Vélez Sarsfield';
		clubRequest.foundationDate = '1910-01-01';
		clubRequest.countryId = country.uuid;
	});

	afterEach(async () => {
		await redisClient.flushdb();
		await deleteAll(datasource, ClubEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
		await redisClient.quit();
	});

	it('Update an existent club.', async () => {
		await request(server)
			.put(`/api/v1.0/clubs/${club.uuid}`)
			.send(clubRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('foundationDate')).to.be.true;
				expect(structure.includes('country')).to.be.true;
			});

		const clubExistent = await findOneWithRelations<ClubEntity>(datasource, ClubEntity, {
			where: { uuid: club.uuid },
			relations: { country: true },
		});
		expect(clubExistent).equal;
		expect(clubExistent?.name).equal(clubRequest.name);
		expect(clubExistent?.foundationDate).deep.equal(new Date(clubRequest.foundationDate));
		expect(clubExistent?.country.uuid).equal(clubRequest.countryId);
	});

	it('Update an existent club with cache.', async () => {
		await redisClient.set('club-' + club.uuid, JSON.stringify(club));

		await request(server)
			.put(`/api/v1.0/clubs/${club.uuid}`)
			.send(clubRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('foundationDate')).to.be.true;
				expect(structure.includes('country')).to.be.true;
			});

		const cachedClub = await redisClient.get('club-' + club.uuid);

		expect(cachedClub).equal(null);
	});

	it('Update an existent club without name.', async () => {
		await request(server)
			.put(`/api/v1.0/clubs/${club.uuid}`)
			.send({ foundationDate: '1910-01-01', countryId: '4a93ee3e-5963-466b-bd22-6bebcea6c935' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});

	it('Update a club with bad uuid param.', async () => {
		await request(server)
			.put('/api/v1.0/clubs/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
