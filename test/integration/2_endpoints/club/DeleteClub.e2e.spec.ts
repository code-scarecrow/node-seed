import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { DataSource } from 'typeorm';
import { deleteAll, findOneBy, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { expect } from 'chai';

describe('Delete Club e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let club: ClubEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();
		club = new ClubEntity();
		club.uuid = '10045785-706e-4652-a929-9d9e019e0591';
		club.name = 'Club Atlético Vélez Sarsfield';
		club.foundationDate = new Date('1910-01-01');
		await insert<ClubEntity>(datasource, [club]);
	});

	afterEach(async () => {
		await deleteAll(datasource, ClubEntity);
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Delete an existent club.', async () => {
		await request(server)
			.delete(`/api/v1.0/clubs/${club.uuid}`)
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const clubExistent = await findOneBy<ClubEntity>(datasource, ClubEntity, {
			uuid: club.uuid,
		});
		expect(clubExistent).equal(null);
	});

	it('Delete a club with bad uuid param.', async () => {
		await request(server)
			.delete('/api/v1.0/clubs/1')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(HttpStatus.BAD_REQUEST)
			.expect((res) => {
				const structure = Object.values(res.body);
				expect(structure.includes('00001')).to.be.true;
			});
	});
});
