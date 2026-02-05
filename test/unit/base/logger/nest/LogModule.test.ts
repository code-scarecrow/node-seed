import { ValueProvider } from '@nestjs/common';
import { expect } from 'chai';
import { AxiosLoggerInterceptor, LoggerConfig, LogModule, LogProvider } from 'src/base/logger';

describe('LogModule Test', () => {
	it('should log full data in requests', () => {
		//Arrange
		const provieder: ValueProvider<LoggerConfig> = {
			provide: LoggerConfig,
			useValue: new LoggerConfig('test'),
		};

		//Act
		const uut = LogModule.register(provieder);

		//Assert
		expect(uut.module).to.be.equal(LogModule);
		expect(uut.exports).to.contain(LogProvider);
		expect(uut.exports).to.contain(AxiosLoggerInterceptor);
	});
});
