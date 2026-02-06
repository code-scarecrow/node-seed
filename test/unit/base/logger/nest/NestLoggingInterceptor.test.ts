import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { CallHandler, HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { expect } from 'chai';
import { Request, Response } from 'express';
import { It, Mock } from 'moq.ts';
import { lastValueFrom, Observable } from 'rxjs';
import { Logger, LogLevels, NestLoggingInterceptor } from 'src/base/logger';

describe('NestLoggingInterceptor Test', () => {
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

	it('should log full data in requests', async () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.method).returns('GET');
		req.setup((r) => r.headers).returns({ host: 'test' });
		req.setup((r) => r.url).returns('https://test/test');
		req.setup((r) => r.body).returns({ test: 'test' });
		const response: Mock<Response> = new Mock();
		response.setup((r) => r.statusCode).returns(HttpStatus.OK);
		const context = getContext(req.object(), response.object());
		const uut = new NestLoggingInterceptor(logger.object());
		const body = { test: 'test' };

		//Act
		await lastValueFrom(uut.intercept(context, getCallHandle(body)));

		//Assert
		expect(logMessages.length).to.be.equal(2);
		expect(logMessages[0]?.level).to.be.equal(LogLevels.INFO);
		expect(logMessages[1]?.level).to.be.equal(LogLevels.INFO);
	});

	it('should not log any data in health-check requests', async () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.method).returns('GET');
		req.setup((r) => r.url).returns('https://test/health-check');
		const response: Mock<Response> = new Mock();
		req.setup((r) => r.statusCode).returns(HttpStatus.OK);
		const context = getContext(req.object(), response.object());
		const uut = new NestLoggingInterceptor(logger.object());
		const body = { test: 'test' };

		//Act
		await lastValueFrom(uut.intercept(context, getCallHandle(body)));

		//Assert
		expect(logMessages.length).to.be.equal(0);
	});

	it('should log full message data.', async () => {
		const message = {
			retry: null,
			app: 'app-example',
			traceId: '234wdfsf2',
			data: {
				code: '4E94M72D',
			},
			timestamp: '12-12-12 00:00:00',
		};
		const context = getRmqContext(message);
		const uut = new NestLoggingInterceptor(logger.object());

		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		expect(logMessages.length).to.be.equal(1);
		expect(logMessages[0]?.level).to.be.equal(LogLevels.INFO);
	});
});

function getContext(req: Request, res: Response): ExecutionContext {
	const context: Mock<ExecutionContext> = new Mock();
	const httpArgumentsHost: Mock<HttpArgumentsHost> = new Mock();
	context.setup((c) => c.switchToHttp()).returns(httpArgumentsHost.object());
	context.setup((mock) => mock.getType()).returns('http');
	httpArgumentsHost.setup((ha) => ha.getRequest()).returns(req);
	httpArgumentsHost.setup((ha) => ha.getResponse()).returns(res);
	return context.object();
}

function getRmqContext(message: unknown): ExecutionContext {
	const context: Mock<ExecutionContext> = new Mock();
	const rpcArgumentsHost: Mock<RpcArgumentsHost> = new Mock();

	context.setup((mock) => mock.switchToRpc()).returns(rpcArgumentsHost.object());
	context.setup((mock) => mock.getType()).returns('rmq');
	rpcArgumentsHost.setup((mock) => mock.getData()).returns(message);

	return context.object();
}

function getCallHandle(resBody: unknown): CallHandler<unknown> {
	const callHandler: Mock<CallHandler> = new Mock();
	const observable = new Observable((s) => {
		s.next(resBody);
		s.complete();
	});
	callHandler.setup((mock) => mock.handle()).returns(observable);
	return callHandler.object();
}
