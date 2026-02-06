import { ExecutionContext } from '@nestjs/common';
import { CallHandler, HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { expect } from 'chai';
import { Request, Response } from 'express';
import { It, Mock } from 'moq.ts';
import { lastValueFrom, Observable } from 'rxjs';
import { ContextInterceptor, storage } from 'src/base/logger';

describe('ContextInterceptor Test', () => {
	it('should set existing trace Id', async () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.headers).returns({ host: 'test', 'x-trace-id': 'test' });
		const context = getContext(req.object());
		const uut = new ContextInterceptor();

		//Act
		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		//Assert
		expect(storage.getStore()).to.be.equal('test');
	});

	it('should set existing trace Id from array', async () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.headers).returns({ host: 'test', 'x-trace-id': ['test1', 'test'] });
		const context = getContext(req.object());
		const uut = new ContextInterceptor();

		//Act
		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		//Assert
		expect(storage.getStore()).to.be.equal('test1');
	});

	it('should create new trace Id if not present in headers', async () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.headers).returns({});
		const context = getContext(req.object());
		const uut = new ContextInterceptor();

		//Act
		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		//Assert
		expect(storage.getStore()?.length).to.be.equal(36);
	});

	it('should set an existing trace Id from message.', async () => {
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
		const uut = new ContextInterceptor();

		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		expect(storage.getStore()).to.be.equal(message.traceId);
	});

	it('should create new trace Id if not present in message.', async () => {
		const message = {
			retry: null,
			app: 'app-example',
			data: {
				code: '4E94M72D',
			},
			timestamp: '12-12-12 00:00:00',
		};
		const context = getRmqContext(message);
		const uut = new ContextInterceptor();

		await lastValueFrom(uut.intercept(context, getCallHandle({})));

		expect(storage.getStore()?.length).to.be.equal(36);
	});
});

function getContext(req: Request): ExecutionContext {
	const context: Mock<ExecutionContext> = new Mock();
	const res: Mock<Response> = new Mock();
	res.setup((m) => m.setHeader(It.IsAny(), It.IsAny())).returns(res.object());
	const httpArgumentsHost: Mock<HttpArgumentsHost> = new Mock();
	context.setup((c) => c.switchToHttp()).returns(httpArgumentsHost.object());
	context.setup((mock) => mock.getType()).returns('http');
	httpArgumentsHost.setup((ha) => ha.getRequest()).returns(req);
	httpArgumentsHost.setup((ha) => ha.getResponse()).returns(res.object());
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
