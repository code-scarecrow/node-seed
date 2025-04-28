import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { Player } from 'src/domain/entities/Player';
import { expect } from 'chai';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Delete Player e2e Test.', () => {
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

	it('Delete an existent player.', async () => {
		await request(server)
			.delete(`/api/v1.0/players/${player.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const playerExistent = await dbClient.getPlayer(player.uuid);
		expect(playerExistent).equal(null);
	});

	it('Delete a player with bad uuid param.', async () => {
		await request(server)
			.delete('/api/v1.0/players/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
