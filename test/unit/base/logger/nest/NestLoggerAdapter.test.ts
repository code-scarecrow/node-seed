import { Mock, Times } from 'moq.ts';
import { Logger, NestLoggerAdapter } from 'src/base/logger';

describe('NestLoggerAdapter Test', () => {
	let logger: Mock<Logger>;

	beforeEach(() => {
		logger = new Mock<Logger>();
	});

	it('should forward log method to info', () => {
		//Arrange
		logger.setup((m) => m.info('test')).returns();
		const uut = new NestLoggerAdapter(logger.object());

		//Act
		uut.log('test');

		//Assert
		logger.verify((l) => l.info('test'), Times.Once());
	});

	it('should forward debug method', () => {
		//Arrange
		logger.setup((m) => m.debug('test')).returns();
		const uut = new NestLoggerAdapter(logger.object());

		//Act
		uut.debug('test');

		//Assert
		logger.verify((l) => l.debug('test'), Times.Once());
	});

	it('should forward warn method', () => {
		//Arrange
		logger.setup((m) => m.warn('test')).returns();
		const uut = new NestLoggerAdapter(logger.object());

		//Act
		uut.warn('test');

		//Assert
		logger.verify((l) => l.warn('test'), Times.Once());
	});

	it('should forward error method', () => {
		//Arrange
		logger.setup((m) => m.error('test')).returns();
		const uut = new NestLoggerAdapter(logger.object());

		//Act
		uut.error('test');

		//Assert
		logger.verify((l) => l.error('test'), Times.Once());
	});
});
