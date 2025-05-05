import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { expect } from 'chai';
import { dbClient } from 'test/integration/setup';

describe('Delete World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCup: WorldCup;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		worldCup = await dbClient.createWorldCup((await dbClient.createCountry()).id, []);
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Delete an existent world cup.', async () => {
		await request(server)
			.delete(`/api/v1.0/world-cups/${worldCup.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const worldCupExistent: WorldCup | null = await dbClient.getWorldCup(worldCup.uuid);
		expect(worldCupExistent).equal(null);
	});

	it('Delete a world cup with bad uuid param.', async () => {
		await request(server)
			.delete('/api/v1.0/world-cups/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
