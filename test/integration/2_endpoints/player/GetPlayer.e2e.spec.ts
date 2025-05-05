import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { Player } from 'src/domain/entities/Player';
import { expect } from 'chai';
import { dbClient } from 'test/integration/setup';

describe('Get Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let player: Player;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		const club = await dbClient.createClub(country.id);
		player = await dbClient.createPlayer(club.id, country.id);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
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
				expect(structure.includes('id'), 'id').to.be.true;
				expect(structure.includes('name'), 'name').to.be.true;
				expect(structure.includes('lastname'), 'lastname').to.be.true;
				expect(structure.includes('country'), 'country').to.be.true;
				expect(structure.includes('club'), 'club').to.be.true;
				expect(structure.includes('birthDate'), 'birthDate').to.be.true;
				expect(structure.includes('createdAt'), 'createdAt').to.be.true;
				expect(structure.includes('updatedAt'), 'updatedAt').to.be.true;
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
