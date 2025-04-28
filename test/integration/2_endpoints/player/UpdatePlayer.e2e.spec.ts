import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { PlayerRequest } from 'src/infrastructure/primary-adapters/http/controllers/player/request/PlayerRequest';
import { Player } from 'src/domain/entities/Player';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Update Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let playerRequest: PlayerRequest;
	let player: Player;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		const club = await dbClient.createClub(country.id);
		player = await dbClient.createPlayer(club.id, country.id);

		playerRequest = new PlayerRequest();
		playerRequest.name = 'Walter';
		playerRequest.lastname = 'Bou';
		playerRequest.birthDate = '1993-08-25';
		playerRequest.position = PositionEnum.CF;
		playerRequest.clubId = club.uuid;
		playerRequest.countryId = country.uuid;
	});

	afterEach(async () => {
		await dbClient.deleteDB();
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

		const playerExistent = await dbClient.getPlayer(player.uuid);
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
