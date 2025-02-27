import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { DataSource } from 'typeorm';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Get Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let player: PlayerEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '1d78c637-3f35-4666-80c0-57f6ff647da9';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		const club = new ClubEntity();
		club.id = 1;
		club.uuid = '1d78c637-3f35-4666-80c0-57f6ff647da8';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		player = new PlayerEntity();
		player.uuid = '1d78c637-3f35-4666-80c0-57f6ff647da7';
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

	it('Get an existent player.', async () => {
		await request(server)
			.get(`/api/v1.0/players/${player.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('lastname')).to.be.true;
				expect(structure.includes('country')).to.be.true;
				expect(structure.includes('club')).to.be.true;
				expect(structure.includes('birthDate')).to.be.true;
				expect(structure.includes('createdAt')).to.be.true;
				expect(structure.includes('updatedAt')).to.be.true;
			});
	});

	it('Get an inexistent player.', async () => {
		await request(server)
			.get('/api/v1.0/players/67d7c4fc-02f4-49ce-befd-3fbd08e6ac25')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.NOT_FOUND)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00002')).to.be.true;
				expect(structure.includes(new EntityNotFound('Player').message)).to.be.true;
			});
	});

	it('Get a player with bad uuid param', async () => {
		await request(server)
			.get('/api/v1.0/players/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
