import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from '../../infrastructure/app/AppInitiator';
import { watch } from '../../infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { ClubRequest } from 'src/infrastructure/primary-adapters/http/controllers/club/request/ClubRequest';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { deleteAll, insert } from '../../infrastructure/database/TestDatasetSeed';
import { DataSource } from 'typeorm';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { expect } from 'chai';

describe('Create Club e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let clubRequest: ClubRequest;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = new CountryEntity();
		country.id = 1;
		country.uuid = '10045785-706e-4652-a929-9d9e019e0590';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		clubRequest = new ClubRequest();
		clubRequest.name = 'Club Atlético Vélez Sarsfield';
		clubRequest.foundationDate = '1910-01-01';
		clubRequest.countryId = country.uuid;
	});

	afterEach(async () => {
		await deleteAll(datasource, ClubEntity);
		await deleteAll(datasource, CountryEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Create new club.', async () => {
		await request(server)
			.post('/api/v1.0/clubs')
			.send(clubRequest)
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED))
			.expect((res) => {
				const structure = Object.keys(res.body);
				expect(structure.includes('id')).to.be.true;
				expect(structure.includes('name')).to.be.true;
				expect(structure.includes('foundationDate')).to.be.true;
				expect(structure.includes('country')).to.be.true;
			});
	});

	it('Create new club without name.', async () => {
		await request(server)
			.post('/api/v1.0/clubs')
			.send({ foundationDate: '1910-01-01', countryId: '10045785-706e-4652-a929-9d9e019e0590' })
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
