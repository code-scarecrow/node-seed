import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { S3Client, GetObjectAttributesCommand } from '@aws-sdk/client-s3';
import { expect } from 'chai';

describe('Create File e2e Test.', () => {
	let app: INestApplication;
	let server: HttpServer;
	let s3client: S3Client;

	before(async () => {
		app = await initiateApp();

		s3client = new S3Client({
			endpoint: 'http://localhost:4566',
			forcePathStyle: true,
			region: 'us-west-2',
			credentials: {
				secretAccessKey: 'test',
				accessKeyId: 'test',
			},
		});
	});

	beforeEach(() => {
		server = app.getHttpServer();
	});

	afterEach(async () => {
		await server.close();
	});

	after(async () => {
		await app.close();
	});

	it('Create new file.', async () => {
		await request(server)
			.post('/api/v1.0/files/test')
			.attach('file', 'test/integration/2_endpoints/file/image.png')
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.CREATED));

		const objectData = await s3client.send(
			new GetObjectAttributesCommand({
				Bucket: 'test-bucket',
				Key: 'test',
				ObjectAttributes: ['ObjectSize'],
			}),
		);

		expect(objectData.ObjectSize).to.be.equals(100465);
	});
});
