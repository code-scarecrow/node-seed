import { RedisConfig } from 'src/infrastructure/secondary-adapters/redis/client/RedisConfig';
import { expect } from 'chai';

describe('Redis Client Test', () => {
	it('Should return correct config', () => {
		//Arrange
		const client = new RedisConfig({
			config: {
				host: 'REDIS_HOST',
				port: parseInt('REDIS_PORT'),
				password: 'REDIS_PASSWORD',
			},
		});

		//Act
		const res = client.createRedisOptions();

		//Assert
		expect(res.config).exist;
	});
});
