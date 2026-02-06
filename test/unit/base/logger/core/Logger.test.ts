import { expect } from 'chai';
import { It, Mock } from 'moq.ts';
import { IWritter, Logger, LogLevels, LogMessage } from 'src/base/logger';

describe('Logger Test', () => {
	let writter: Mock<IWritter>;
	let logMessages: LogMessage[];

	beforeEach(() => {
		writter = new Mock<IWritter>();
		writter.setup((w) => w.writeMessage(It.IsAny())).callback(({ args: [m] }) => logMessages.push(m));
		logMessages = [];
	});

	it('should write correct message', () => {
		//Arrange
		const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter.object(), () => undefined);

		//Act
		uut.info('test');

		//Assert
		expect(logMessages[0]?.appName).to.be.equal('testAppName');
	});

	it('should not write if level is under log level', () => {
		//Arrange
		const uut = new Logger(LogLevels.WARN, 'testAppName', writter.object(), () => undefined);

		//Act
		uut.info('test');

		//Assert
		expect(logMessages[0]).to.be.undefined;
	});

	it('should write correct log level', () => {
		//Arrange
		const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter.object(), () => undefined);

		//Act
		uut.debug('test');
		uut.info('test');
		uut.warn('test');
		uut.error('test');

		//Assert
		expect(logMessages[0]?.level).to.be.equal(LogLevels.DEBUG);
		expect(logMessages[1]?.level).to.be.equal(LogLevels.INFO);
		expect(logMessages[2]?.level).to.be.equal(LogLevels.WARN);
		expect(logMessages[3]?.level).to.be.equal(LogLevels.ERROR);
	});

	it('should get traceId', () => {
		//Arrange
		const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter.object(), () => 'test');

		//Act
		uut.info('test');

		//Assert
		expect(logMessages[0]?.traceId).to.be.equal('test');
	});

	it('should force traceId', () => {
		//Arrange
		const uut = new Logger(LogLevels.DEBUG, 'testAppName', writter.object(), () => undefined);

		//Act
		uut.debug('test', undefined, 'test');
		uut.info('test', undefined, 'test');
		uut.warn('test', undefined, 'test');
		uut.error('test', undefined, 'test');

		//Assert
		expect(logMessages[0]?.traceId).to.be.equal('test');
		expect(logMessages[1]?.traceId).to.be.equal('test');
		expect(logMessages[2]?.traceId).to.be.equal('test');
		expect(logMessages[3]?.traceId).to.be.equal('test');
	});
});
