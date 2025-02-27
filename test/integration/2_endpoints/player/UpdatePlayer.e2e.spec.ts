import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, findOneWithRelations, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { PlayerRequest } from 'src/infrastructure/primary-adapters/http/controllers/player/request/PlayerRequest';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Update Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let playerRequest: PlayerRequest;
	let player: PlayerEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = new CountryEntity();
		country.id = 1;
		country.uuid = 'e70806a3-5136-47be-99df-bc0ce4a09f86';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		const club = new ClubEntity();
		club.id = 1;
		club.uuid = 'e70806a3-5136-47be-99df-bc0ce4a09f87';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		player = new PlayerEntity();
		player.uuid = 'e70806a3-5136-47be-99df-bc0ce4a09f88';
		player.name = 'Walte';
		player.lastname = 'Buo';
		player.birthDate = new Date('1993-08-26');
		player.position = PositionEnum.GK;
		player.createdAt = new Date();
		player.updatedAt = new Date();
		player.country = country;
		player.club = club;

		await insert<PlayerEntity>(datasource, [player]);

		playerRequest = new PlayerRequest();
		playerRequest.name = 'Walter';
		playerRequest.lastname = 'Bou';
		playerRequest.birthDate = '1993-08-25';
		playerRequest.position = PositionEnum.CF;
		playerRequest.clubId = 'e70806a3-5136-47be-99df-bc0ce4a09f87';
		playerRequest.countryId = 'e70806a3-5136-47be-99df-bc0ce4a09f86';
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

	it('Update an existent player.', async () => {
		await request(server)
			.put(`/api/v1.0/players/${player.uuid}`)
			.send(playerRequest)
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
				expect(structure.includes('position')).to.be.true;
				expect(structure.includes('createdAt')).to.be.true;
				expect(structure.includes('updatedAt')).to.be.true;
			});

		const playerExistent = await findOneWithRelations<PlayerEntity>(datasource, PlayerEntity, {
			where: { uuid: player.uuid },
			relations: { country: true, club: true },
		});
		expect(playerExistent).equal;
		expect(playerExistent?.name).equal(playerRequest.name);
		expect(playerExistent?.lastname).equal(playerRequest.lastname);
		expect(playerExistent?.country?.uuid).equal(playerRequest.countryId);
		expect(playerExistent?.club?.uuid).equal(playerRequest.clubId);
		expect(playerExistent?.birthDate).deep.equal(new Date(playerRequest.birthDate));
		expect(playerExistent?.position).equal(playerRequest.position);
	});

	it('Update an existent player without name.', async () => {
		await request(server)
			.put(`/api/v1.0/players/${player.uuid}`)
			.send({
				lastname: 'Bou',
				birthDate: '1910-01-01',
				clubId: '67d7c4fc-02f4-49ce-befd-3fbd08e6ac25',
				countryId: '67d7c4fc-02f4-49ce-befd-3fbd08e6ac24',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});

	it('Update a player with bad uuid param.', async () => {
		await request(server)
			.put('/api/v1.0/players/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
