import { expect } from 'chai';

describe('Type orm datasource Test', () => {
	it('Should be able to generate datasource', () => {
		//Arrange
		process.env['DATABASE_HOST'] = 'database';
		process.env['DATABASE_PORT'] = '3306';
		process.env['DATABASE_NAME'] = ':memory:';
		process.env['DATABASE_PASS'] = 'pickit';
		process.env['DATABASE_USER'] = 'pickit';
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { datasource } = require('src/infrastructure/secondary-adapters/database/client/datasource');

		//Act
		const res = datasource;

		//Assert
		expect(res).exist;
	});
});
