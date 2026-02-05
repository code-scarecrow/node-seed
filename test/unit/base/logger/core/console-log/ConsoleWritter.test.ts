import { expect } from 'chai';
import { LogLevels, LogMessage } from 'src/base/logger';
import { ConsoleWritter } from 'src/base/logger/core/console-log/ConsoleWritter';

describe('ConsoleWritter Test', () => {
	it('should write correct message', async () => {
		//Arrange
		const uut = new ConsoleWritter();
		const logMessage: LogMessage = {
			timeStamp: new Date(Date.UTC(2022, 8, 30, 18, 16, 16, 34)),
			appName: 'test',
			traceId: 'test',
			level: LogLevels.INFO,
			levelName: 'Info',
			message: 'test - message',
		};
		const expectedRes =
			'{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Info","message":"test - message"}';
		let res = '';
		console.log = (a: string) => (res = a);

		//Act
		uut.writeMessage(logMessage);

		//Assert
		expect(res).to.be.equal(expectedRes);
	});

	it('should write correct message', async () => {
		//Arrange
		const uut = new ConsoleWritter();
		const logMessage: LogMessage = {
			timeStamp: new Date(Date.UTC(2022, 8, 30, 18, 16, 16, 34)),
			appName: 'test',
			traceId: 'test',
			level: LogLevels.ERROR,
			levelName: 'Error',
			message: 'test - message',
		};
		const expectedRes =
			'{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Error","message":"test - message"}';
		let res = '';
		console.error = (a: string) => (res = a);

		//Act
		uut.writeMessage(logMessage);

		//Assert
		expect(res).to.be.equal(expectedRes);
	});

	it('should write correct message', async () => {
		//Arrange
		const uut = new ConsoleWritter();
		const logMessage: LogMessage = {
			timeStamp: new Date(Date.UTC(2022, 8, 30, 18, 16, 16, 34)),
			appName: 'test',
			traceId: 'test',
			level: LogLevels.WARN,
			levelName: 'Warning',
			message: 'test - message',
		};
		const expectedRes =
			'{"timeStamp":"2022-09-30T18:16:16.034Z","traceId":"test","appName":"test","level":"Warning","message":"test - message"}';
		let res = '';
		console.error = (a: string) => (res = a);

		//Act
		uut.writeMessage(logMessage);

		//Assert
		expect(res).to.be.equal(expectedRes);
	});
});
