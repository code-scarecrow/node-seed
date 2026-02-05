import { ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { BaseComplexError, BaseError, ErrorCodesMapperBase, ExceptionsFilter } from 'src/base/nest/errors';
import { It, Mock } from 'moq.ts';
import { Logger } from 'src/base/logger';
import { expect } from 'chai';

enum ErrorCodesEnum {
	ERROR_1 = '1',
	ERROR_2 = '2',
}

class EntityNotFound extends BaseError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.ERROR_1, `${entityName} was not found`);
	}
}

class ComplexEntityNotFound extends BaseComplexError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.ERROR_1, `${entityName} was not found`, ['test1']);
	}
}

describe('Service Transaction Test.', () => {
	let uut: ExceptionsFilter<ErrorCodesEnum>;
	let argumentsHost: Mock<ArgumentsHost>;
	let httpArgumentsHost: Mock<HttpArgumentsHost>;
	let rpcArgumentsHost: Mock<RpcArgumentsHost>;
	let response: Mock<Response>;
	let status: HttpStatus;
	let logger: Mock<Logger>;
	let responseBody: unknown;

	beforeEach(() => {
		//initialize test variables
		status = HttpStatus.I_AM_A_TEAPOT;
		responseBody = null;

		argumentsHost = new Mock<ArgumentsHost>();
		httpArgumentsHost = new Mock<HttpArgumentsHost>();
		logger = new Mock<Logger>();
		response = new Mock<Response>();
		logger.setup((m) => m.error(It.IsAny())).returns(undefined);
		logger.setup((m) => m.info(It.IsAny())).returns(undefined);

		argumentsHost.setup((ah) => ah.switchToHttp()).returns(httpArgumentsHost.object());
		argumentsHost.setup((ah) => ah.getType()).returns('');
		httpArgumentsHost.setup((hah) => hah.getResponse()).returns(response.object());
		response
			.setup((r) => r.status(It.IsAny<HttpStatus>()))
			.callback(({ args: [arg1] }) => {
				status = arg1;
				return response.object();
			});
		response
			.setup((r) => r.json(It.IsAny()))
			.callback(({ args: [arg1] }) => {
				responseBody = arg1;
				return response.object();
			});
		response.setup((r) => r.getHeader(It.IsAny())).returns(undefined);
		const errorMapper: Mock<ErrorCodesMapperBase<ErrorCodesEnum>> = new Mock<ErrorCodesMapperBase<ErrorCodesEnum>>();
		errorMapper.setup((e) => e.mapError(It.IsAny<ErrorCodesEnum>())).returns(HttpStatus.NOT_FOUND);
		uut = new ExceptionsFilter(logger.object(), errorMapper.object());
		rpcArgumentsHost = new Mock<RpcArgumentsHost>();
	});

	it('should map http status.', () => {
		//Arrange
		const err = new EntityNotFound('1');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(status).to.be.equal(HttpStatus.NOT_FOUND);
	});

	it('should return simple response body.', () => {
		//Arrange
		const err = new EntityNotFound('1');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).to.be.deep.equal({
			code: ErrorCodesEnum.ERROR_1,
			message: '1 was not found',
		});
	});

	it('should return complex response body.', () => {
		//Arrange
		const err = new ComplexEntityNotFound('1');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).to.be.deep.equal({
			code: ErrorCodesEnum.ERROR_1,
			message: '1 was not found',
			errors: ['test1'],
		});
	});

	it('should return default response body.', () => {
		//Arrange
		const err = new Error('random error');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).to.be.deep.equal({
			message: 'internal server error',
		});
	});

	it('should return rpc status error.', () => {
		//Arrange
		const err = new Error('random error');
		argumentsHost.setup((ah) => ah.switchToRpc()).returns(rpcArgumentsHost.object());
		argumentsHost.setup((ah) => ah.getType()).returns('rmq');
		response.setup((r) => r.end(It.IsAny())).returns({} as Response<unknown, Record<string, unknown>>);

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).to.be.deep.equal({
			message: 'internal server error',
		});
	});

	it('should map http 404 status.', () => {
		//Arrange
		const err = new NotFoundException();

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(status).to.be.equal(HttpStatus.NOT_FOUND);
	});
});
