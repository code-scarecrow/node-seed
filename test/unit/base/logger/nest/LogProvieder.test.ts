import { expect } from 'chai';
import { LoggerConfig, LogProvider } from 'src/base/logger';

describe('LogProvieder Test', () => {
	it('should create a logger instance', async () => {
		//Arrange
		const config = new LoggerConfig('test');

		//Act
		const logger = await LogProvider.useFactory(config);

		//Assert
		expect(logger).to.not.be.undefined;
	});
});
