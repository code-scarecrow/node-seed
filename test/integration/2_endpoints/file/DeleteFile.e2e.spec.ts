import { HttpServer, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initiateApp } from 'test/integration/infrastructure/app/AppInitiator';
import { watch } from 'test/integration/infrastructure/app/ResponseWatcher';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { expect } from 'chai';
import { readFileSync } from 'node:fs';

describe('Delete File e2e Test.', () => {
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

	it('Delete a file.', async () => {
		await s3client.send(
			new PutObjectCommand({
				Bucket: 'test-bucket',
				Key: 'test',
				Body: readFileSync('test/integration/2_endpoints/file/image.png'),
			}),
		);

		await request(server)
			.delete('/api/v1.0/files/test')
			.send()
			.set('Country-Code', CountryCodeEnum.AR)
			.expect(watch(HttpStatus.NO_CONTENT));

		const objectsData = await s3client.send(
			new ListObjectsV2Command({
				Bucket: 'test-bucket',
			}),
		);

		expect(objectsData.Contents).to.be.undefined;
	});
});
