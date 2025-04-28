import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';
import { WorldCupRequest } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/request/WorldCupRequest';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Update World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCupRequest: WorldCupRequest;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = await dbClient.createCountry();
		worldCup = await dbClient.createWorldCup(country.id, []);

		worldCupRequest = new WorldCupRequest();
		worldCupRequest.petName = 'Gauchito';
		worldCupRequest.year = '1978';
		worldCupRequest.startDate = '1978-06-01';
		worldCupRequest.finishDate = '1978-06-25';
		worldCupRequest.countryId = country.uuid;
	});

	afterEach(async () => {
		await dbClient.deleteDB();
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Update an existent world cup.', async () => {
		await request(server)
			.put(`/api/v1.0/world-cups/${worldCup.uuid}`)
			.send(worldCupRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.OK))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('petName')).to.be.true;
				expect(structure.includes('year')).to.be.true;
				expect(structure.includes('startDate')).to.be.true;
				expect(structure.includes('finishDate')).to.be.true;
				expect(structure.includes('location')).to.be.true;
			});

		const worldCupExistent: WorldCupEntity | null = await dbClient.getWorldCup(worldCup.uuid);
		expect(worldCupExistent).exist;
		expect(worldCupExistent?.petName).equal(worldCupRequest.petName);
		expect(worldCupExistent?.year).equal(worldCupRequest.year);
		expect(worldCupExistent?.startDate).deep.equal(new Date(worldCupRequest.startDate));
		expect(worldCupExistent?.finishDate).deep.equal(new Date(worldCupRequest.finishDate));
		expect(worldCupExistent?.location?.uuid).equal(worldCupRequest.countryId);
	});

	it('Update an existent world cup with bad dates.', async () => {
		worldCupRequest.finishDate = worldCupRequest.startDate;
		await request(server)
			.put(`/api/v1.0/world-cups/${worldCup.uuid}`)
			.send(worldCupRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});

	it('Update a world cup with bad uuid param.', async () => {
		await request(server)
			.put('/api/v1.0/world-cups/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
