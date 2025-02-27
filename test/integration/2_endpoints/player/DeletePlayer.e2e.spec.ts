import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { DataSource } from 'typeorm';
import { deleteAll, findOneBy, insert } from 'test/integration/infrastructure/database/TestDatasetSeed';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { expect } from 'chai';

describe('Delete Player e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let datasource: DataSource;
	let player: PlayerEntity;

	before(async () => {
		app = await initiateApp();
		datasource = app.get(DataSource);
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		player = new PlayerEntity();
		player.uuid = '67d7c4fc-02f4-49ce-befd-3fbd08e6ac28';
		player.name = 'Walter';
		player.lastname = 'Bou';
		player.birthDate = new Date('1993-08-25');
		player.position = PositionEnum.CF;
		player.createdAt = new Date();
		player.updatedAt = new Date();

		await insert<PlayerEntity>(datasource, [player]);
	});

	afterEach(async () => {
		await deleteAll(datasource, PlayerEntity);
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

		const playerExistent = await findOneBy<PlayerEntity>(datasource, PlayerEntity, {
			uuid: player.uuid,
		});
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
