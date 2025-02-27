import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Get Country with players e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let country: CountryEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		country = new CountryEntity();
		country.id = 1;
		country.uuid = '7c146bc5-378a-41b5-ade5-e9609a2b7c3e';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		const club = new ClubEntity();
		club.id = 1;
		club.uuid = '7c146bc5-378a-41b5-ade5-e9609a2b7c3f';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		const player = new PlayerEntity();
		player.uuid = '7c146bc5-378a-41b5-ade5-e9609a2b7c3g';
		player.name = 'Walter';
		player.lastname = 'Bou';
		player.birthDate = new Date('1993-08-25');
		player.position = PositionEnum.CF;
		player.createdAt = new Date();
		player.updatedAt = new Date();
		player.country = country;
		player.club = club;

		await insert<PlayerEntity>(datasource, [player]);
	});

	afterEach(async () => {
		await deleteAll(datasource, PlayerEntity);
		await deleteAll(datasource, ClubEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Get an existent country.', async () => {
		await request(server)
			.get(`/api/v1.0/countries/${country.uuid}/players`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('code')).to.be.true;
				expect(structure.includes('players')).to.be.true;
			});
	});

	it('Get an inexistent country.', async () => {
		await request(server)
			.get('/api/v1.0/countries/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25/players')
			.send({ code: 'ARG' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.NOT_FOUND)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00002')).to.be.true;
				expect(structure.includes(new EntityNotFound('Country').message)).to.be.true;
			});
	});

	it('Get a country with bad uuid param', async () => {
		await request(server)
			.get('/api/v1.0/countries/1/players')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
