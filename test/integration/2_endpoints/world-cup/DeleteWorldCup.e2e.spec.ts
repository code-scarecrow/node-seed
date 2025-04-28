import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import { dbClient } from 'test/integration/infrastructure/database/DBClient';

describe('Delete World Cup e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let worldCup: WorldCupEntity;

	before(async () => {
		app = await initiateApp();
	});

	beforeEach(async () => {
		server = app.getHttpServer();

		worldCup = new WorldCupEntity();
		worldCup.uuid = '67d7c4fc-02f4-49ce-befd-3fbd08e6ac42';
		worldCup.petName = 'Gauchito';
		worldCup.year = '1978';
		worldCup.startDate = new Date('1978-06-01');
		worldCup.finishDate = new Date('1978-06-25');

		await new PrismaClient().world_cups.create({
			data: {
				uuid: worldCup.uuid,
				pet_name: worldCup.petName,
				year: worldCup.year,
				start_date: worldCup.startDate,
				finish_date: worldCup.finishDate,
				countries: {
					create: {
						uuid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						name: 'Argentina',
						code: CountryCodeEnum.AR,
					},
				},
			},
		});
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

		const worldCupExistent: WorldCupEntity | null = await dbClient.getWorldCup(worldCup.uuid);
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
