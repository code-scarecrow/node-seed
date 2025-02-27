import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { DataSource } from 'typeorm';
import { PlayerRequest } from 'src/infrastructure/primary-adapters/http/controllers/player/request/PlayerRequest';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Create Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let playerRequest: PlayerRequest;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '524e8b1c-b768-486f-8672-cd1bdec6151a';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		const club = new ClubEntity();
		club.uuid = '524e8b1c-b768-486f-8672-cd1bdec6151b';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		club.country = country;

		await insert<ClubEntity>(datasource, [club]);

		playerRequest = new PlayerRequest();
		playerRequest.name = 'Walter';
		playerRequest.lastname = 'Bou';
		playerRequest.birthDate = '1993-08-25';
		playerRequest.position = PositionEnum.CF;
		playerRequest.clubId = '524e8b1c-b768-486f-8672-cd1bdec6151b';
		playerRequest.countryId = '524e8b1c-b768-486f-8672-cd1bdec6151a';
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

	it('Create new player.', async () => {
		await request(server)
			.post('/api/v1.0/players')
			.send(playerRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED))
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
