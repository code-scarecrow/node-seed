import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { DataSource } from 'typeorm';
import { deleteAll, findOneWithRelations, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { WorldCupRequest } from 'src/infrastructure/primary-adapters/http/controllers/world-cup/request/WorldCupRequest';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';

describe('Update World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let worldCupRequest: WorldCupRequest;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		const country = new CountryEntity();
		country.id = 1;
		country.uuid = 'e225043d-b32d-4dfb-af40-036eefa3e388';
		country.code = 'ARG';
		country.name = 'Argentina';

		await insert<CountryEntity>(datasource, [country]);

		worldCup = new WorldCupEntity();
		worldCup.uuid = 'e225043d-b32d-4dfb-af40-036eefa3e389';
		worldCup.petName = "La'eeb";
		worldCup.year = '2022';
		worldCup.startDate = new Date('2022-11-20');
		worldCup.finishDate = new Date('2022-12-18');
		worldCup.location = country;

		await insert<WorldCupEntity>(datasource, [worldCup]);

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

		const worldCupExistent: WorldCupEntity | null = await findOneWithRelations<WorldCupEntity>(
			datasource,
			WorldCupEntity,
			{
				where: { uuid: worldCup.uuid },
				relations: { location: true },
			},
		);
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
