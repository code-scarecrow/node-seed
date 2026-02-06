import { expect } from 'chai';
import { It, Mock } from 'moq.ts';
import { Logger, LogLevels, QueueInterceptor, storage } from 'src/base/logger';

describe('QueueInterceptor test.', () => {
	let logger: Mock<Logger>;
	let logMessages: { message: string; metadata: unknown; level: LogLevels }[];
	const message = {
		retry: null,
		app: 'app-example',
		traceId: '',
		data: {
			code: '4E94M72D',
		},
		timestamp: '12-12-12 00:00:00',
	};

	beforeEach(() => {
		logger = new Mock<Logger>();
		logger
			.setup((l) => l.info(It.IsAny(), It.IsAny()))
			.callback(({ args: [m, md] }) => logMessages.push({ message: m, metadata: md, level: LogLevels.INFO }));
		logger
			.setup((l) => l.error(It.IsAny(), It.IsAny()))
			.callback(({ args: [m, md] }) => logMessages.push({ message: m, metadata: md, level: LogLevels.ERROR }));
		logMessages = [];
	});

	it('Should get traceId.', () => {
		//Arrange
		const traceId = '52b971f9-ccef-431d-9550-0d7c2bb3e8bf';
		storage.enterWith(traceId);
		const interceptor = new QueueInterceptor(logger.object());

		//Act
		const result = interceptor.getTraceId();

		//Assert
		expect(result).to.be.equal(traceId);
	});

	it('Should throw error getting traceId.', () => {
		//Arrange
		storage.disable();
		const interceptor = new QueueInterceptor(logger.object());

		//Act
		const result = (): string => interceptor.getTraceId();

		//Assert
		expect(result).to.throw('traceId not found');
	});

	it('Should log message.', () => {
		//Arrange
		const interceptor = new QueueInterceptor(logger.object());

		//Act
		interceptor.logMessage(message);

		//Assert
		expect(logMessages.length).to.be.equal(1);
		expect(logMessages[0]?.level).to.be.equal(LogLevels.INFO);
	});
});
