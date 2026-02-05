import { HttpStatus } from '@nestjs/common';
import { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import { It, Mock } from 'moq.ts';
import { AxiosLoggerInterceptor, Logger, LogLevels } from 'src/base/logger';

describe('AxiosLoggerInterceptor Test', () => {
	let logger: Mock<Logger>;
	let logMessages: { message: string; metadata: unknown; level: LogLevels }[];

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

	it('should log full data in requests', () => {
		//Arrange
		const expectedMetadata = {
			method: 'test',
			domain: 'test',
			endpoint: 'http://test.com',
			queryParams: {
				id: 'id',
			},
			body: {
				test: 'test',
			},
			headers: {
				test: 'test',
			},
		};
		const req: InternalAxiosRequestConfig<unknown> = {
			method: 'test',
			baseURL: 'test',
			url: 'http://test.com',
			data: { test: 'test' },
			headers: new AxiosHeaders({ test: 'test' }),
			params: { id: 'id' },
		};
		const uut = new AxiosLoggerInterceptor(logger.object());

		//Act
		uut.interceptRequest(req);

		//Assert
		expect(logMessages[0]?.level).to.be.equal(LogLevels.INFO);
		expect(logMessages[0]?.message).to.be.equal('External request');
		expect(JSON.stringify(logMessages[0]?.metadata)).to.be.equals(JSON.stringify(expectedMetadata));
	});

	it('should log full data in response', () => {
		//Arrange
		const expectedMetadata = {
			statusCode: HttpStatus.OK,
			headers: { test: 'test' },
			body: {
				id: 'test',
			},
		};
		const res: AxiosResponse<unknown> = {
			status: HttpStatus.OK,
			data: { id: 'test' },
			statusText: 'Ok',
			headers: { test: 'test' },
			config: { headers: new AxiosHeaders() },
		};
		const uut = new AxiosLoggerInterceptor(logger.object());

		//Act
		uut.interceptResponse(res);

		//Assert
		expect(logMessages[0]?.level).to.be.equal(LogLevels.INFO);
		expect(logMessages[0]?.message).to.be.equal('External response');
		expect(JSON.stringify(logMessages[0]?.metadata)).to.be.equals(JSON.stringify(expectedMetadata));
	});

	it('should log full data in response error', async () => {
		//Arrange
		const expectedMetadata = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			body: {
				id: 'test',
			},
			headers: { test: 'test' },
		};
		const err: AxiosError<unknown> = {
			response: {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				data: { id: 'test' },
				statusText: 'Internal server error',
				headers: new AxiosHeaders({ test: 'test' }),
				config: { headers: new AxiosHeaders() },
			},
			config: { headers: new AxiosHeaders() },
			isAxiosError: true,
			toJSON: () => {
				return {};
			},
			name: '',
			message: '',
		};
		const uut = new AxiosLoggerInterceptor(logger.object());

		//Act
		const getResult = uut.interceptFailedResponse(err);

		//Assert
		await expect(getResult).to.be.rejectedWith(err);
		expect(logMessages[0]?.level).to.be.equal(LogLevels.ERROR);
		expect(logMessages[0]?.message).to.be.equal('External response');
		expect(JSON.stringify(logMessages[0]?.metadata)).to.be.equals(JSON.stringify(expectedMetadata));
	});
});
