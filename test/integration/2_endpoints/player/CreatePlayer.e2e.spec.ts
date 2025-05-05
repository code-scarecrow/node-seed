import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { PlayerRequest } from 'src/infrastructure/primary-adapters/http/controllers/player/request/PlayerRequest';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';
import { dbClient } from 'test/integration/setup';

describe('Create Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let playerRequest: PlayerRequest;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = await dbClient.createCountry();
		const club = await dbClient.createClub(country.id);

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

	it('Create new player.', async () => {
		await request(server)
			.post('/api/v1.0/players')
			.send(playerRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id'), 'id').to.be.true;
				expect(structure.includes('name'), 'name').to.be.true;
				expect(structure.includes('lastname'), 'lastname').to.be.true;
				expect(structure.includes('country'), 'country').to.be.true;
				expect(structure.includes('club'), 'club').to.be.true;
				expect(structure.includes('birthDate'), 'birthDate').to.be.true;
				expect(structure.includes('position'), 'position').to.be.true;
				expect(structure.includes('createdAt'), 'createdAt').to.be.true;
				expect(structure.includes('updatedAt'), 'updatedAt').to.be.true;
			});
	});

	it('Create new player without name.', async () => {
		await request(server)
			.post('/api/v1.0/players')
			.send({
				lastname: 'Bou',
				birthDate: '1910-01-01',
				clubId: '524e8b1c-b768-486f-8672-cd1bdec6151b',
				countryId: '524e8b1c-b768-486f-8672-cd1bdec6151a',
			})
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
