import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { deleteAll, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { DataSource } from 'typeorm';
import { WorldCupRequest } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/request/WorldCupRequest';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Create World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let worldCupRequest: WorldCupRequest;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '49f8135e-3331-4854-9afc-587dd4f9b6cb';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		worldCupRequest = new WorldCupRequest();
		worldCupRequest.petName = 'Gauchito';
		worldCupRequest.year = '1978';
		worldCupRequest.startDate = '1978-06-01';
		worldCupRequest.finishDate = '1978-06-25';
		worldCupRequest.countryId = country.uuid;
	});

	afterEach(async () => {
		await deleteAll(datasource, WorldCupEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Create new World Cup.', async () => {
		await request(server)
			.post('/api/v1.0/world-cups')
			.send(worldCupRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('petName')).to.be.true;
				expect(structure.includes('year')).to.be.true;
				expect(structure.includes('startDate')).to.be.true;
				expect(structure.includes('finishDate')).to.be.true;
				expect(structure.includes('location')).to.be.true;
			});
	});

	it('Create new world cup with bad dates.', async () => {
		worldCupRequest.finishDate = worldCupRequest.startDate;

		await request(server)
			.post('/api/v1.0/world-cups')
			.send(worldCupRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
