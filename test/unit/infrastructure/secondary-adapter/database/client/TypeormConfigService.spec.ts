import { MariaDBOptionsFactory } from 'src/infrastructure/secondary-adapters/database/client/MariaDBOptionsFactory';
import { IDatabaseConfig } from 'src/infrastructure/secondary-adapters/database/config/IDatabaseConfig';
import { expect } from 'chai';

describe('DB Client Test', () => {
	it('Should return correct config', () => {
		//Arrange
		const config: IDatabaseConfig = {
			host: 'test',
			port: 0,
			username: 'test',
			password: 'test',
			database: 'test',
			entities: ['test'],
			autoloadEntities: true,
		};
		const client = new MariaDBOptionsFactory(config);

		//Act
		const res = client.createTypeOrmOptions();

		//Assert
		expect(res.database).equal(config.database);
		expect(res.type).equal('mariadb');
	});
});
