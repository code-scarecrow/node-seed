import 'reflect-metadata';
import { exec } from 'child_process';
import { DBClient } from './infrastructure/database/DBClient';
import { setUpDynamo } from './infrastructure/test-containers/dynamodb/setup';
import { takeDownDynamo } from './infrastructure/test-containers/dynamodb/teardown';
import { setUpMysql } from './infrastructure/test-containers/mysql/setup';
import { takeDownMysql } from './infrastructure/test-containers/mysql/teardown';
import { setUpRabbit } from './infrastructure/test-containers/rabbit/setup';
import { takeDownRabbit } from './infrastructure/test-containers/rabbit/teardown';
import { setUpRedis } from './infrastructure/test-containers/redis/setup';
import { takeDownRedis } from './infrastructure/test-containers/redis/teardown';
import { setUpS3 } from './infrastructure/test-containers/s3/setup';
import { takeDownS3 } from './infrastructure/test-containers/s3/teardown';

export let dbClient: DBClient;

before(async function () {
	this.timeout(100000);

	//Set env variables:
	process.env['APP_NAME'] = 'ms-seed';
	process.env['DATABASE_URL'] = 'mysql://root:root@localhost:3306/db';
	process.env['AWS_ACCESS_KEY_ID'] = 'TEST';
	process.env['AWS_SECRET_ACCESS_KEY'] = 'TESTKEY';
	process.env['AWS_ENDPOINT'] = 'http://localhost:8000';
	process.env['AWS_ENDPOINT_S3'] = 'http://localhost:4566';
	process.env['AWS_FORCE_PATH_STYLE'] = 'true';
	process.env['AWS_BUCKET_NAME'] = 'test-bucket';
	process.env['AWS_REGION'] = 'us-west-2';
	process.env['DYNAMODB_TABLE_NAME_RABBITS'] = 'rabbits';
	process.env['SUPER_HERO_URL'] = 'http://json-server';
	process.env['RABBIT_URI'] = 'amqp://guest:guest@0.0.0.0:5672/';
	process.env['RABBIT_QUEUE'] = 'ms-seed-consumer';
	process.env['RABBIT_EVENT_BUS_EXCHANGE'] = 'event_bus_example';
	process.env['REDIS_HOST'] = 'localhost';
	process.env['REDIS_PORT'] = '6379';
	process.env['REDIS_USER'] = 'mocked-user';
	process.env['REDIS_PASSWORD'] = 'mocked-password';
	process.env['TTL'] = '3300';

	await Promise.all([
		setUpDynamo(),
		setUpRabbit('guest', 'guest', 'docker/rabbitmq/conf.json'),
		setUpRedis(),
		setUpS3(),
		setUpMysql(),
	]);

	await runNpmCommandWithEnv();

	dbClient = new DBClient();
});

after(async function () {
	this.timeout(100000);
	await Promise.all([takeDownDynamo(), takeDownRabbit(), takeDownRedis(), takeDownS3(), takeDownMysql()]);
});

function runNpmCommandWithEnv(): Promise<void> {
	return new Promise((resolve) => {
		exec('npm run migration:run', { env: process.env }, (error, stdout, stderr) => {
			if (stderr) {
				console.error(`Stderr: ${stderr}`);
			}

			console.log(`Stdout: ${stdout}`);

			if (error) throw error;
			resolve();
		});
	});
}
