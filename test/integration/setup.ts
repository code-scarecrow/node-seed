import { setUpRedis } from '@code-scarecrow/base-tests/redis/setup';
import { takeDownRedis } from '@code-scarecrow/base-tests/redis/teardown';
import { setUpRabbit } from '@code-scarecrow/base-tests/rabbit/setup';
import { takeDownRabbit } from '@code-scarecrow/base-tests/rabbit/teardown';
import { setUpDynamo } from '@code-scarecrow/base-tests/dynamodb/setup';
import { takeDownDynamo } from '@code-scarecrow/base-tests/dynamodb/teardown';
import { setUpS3 } from '@code-scarecrow/base-tests/s3/setup';
import { takeDownS3 } from '@code-scarecrow/base-tests/s3/teardown';
import { setUpMysql } from '@code-scarecrow/base-tests/mysql/setup';
import { takeDownMysql } from '@code-scarecrow/base-tests/mysql/teardown';
import { exec } from 'child_process';

before(async function () {
	this.timeout(100000);

	//Set env variables:
	process.env['APP_NAME'] = 'ms-seed';
	process.env['DATABASE_HOST'] = 'localhost';
	process.env['DATABASE_NAME'] = 'pickit';
	process.env['DATABASE_PASS'] = 'pickit';
	process.env['DATABASE_USER'] = 'pickit';
	process.env['AWS_ACCESS_KEY_ID'] = 'TEST';
	process.env['AWS_SECRET_ACCESS_KEY'] = 'TESTKEY';
	process.env['AWS_ENDPOINT'] = 'http://localhost:8000';
	process.env['AWS_ENDPOINT_S3'] = 'http://localhost:4566';
	process.env['AWS_FORCE_PATH_STYLE'] = 'true';
	process.env['AWS_BUCKET_NAME'] = 'test-bucket';
	process.env['AWS_REGION'] = 'us-west-2';
	process.env['DYNAMODB_TABLE_NAME_RABBITS'] = 'rabbits';
	process.env['SUPER_HERO_URL'] = 'http://json-server';
	process.env['CORE_API_KEY'] = 'mocked-api-key';
	process.env['CORE_URL_AR'] = 'http://mocked-ar-url';
	process.env['CORE_URL_CO'] = 'http://mocked-co-url';
	process.env['CORE_URL_UY'] = 'http://mocked-uy-url';
	process.env['CORE_URL_MX'] = 'http://mocked-mx-url';
	process.env['CORE_URL_CL'] = 'http://mocked-cl-url';
	process.env['CORE_URL_PE'] = 'http://mocked-pe-url';
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
