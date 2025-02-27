import { It, Mock } from 'moq.ts';
import { ErrorCodesMapper } from 'src/infrastructure/primary-adapters/filters/ErrorCodesMapper';
import { ArgumentsHost, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import { ErrorCodesEnum } from 'src/domain/errors/ErrorCodesEnum';
import { Logger } from '@code-scarecrow/base/logger';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { expect } from 'chai';
import { CustomExceptionsFilter } from 'src/infrastructure/primary-adapters/filters/CustomExceptionsFilter';

describe('CustomExceptionFilter Test.', () => {
	let uut: CustomExceptionsFilter;
	let argumentsHost: Mock<ArgumentsHost>;
	let httpArgumentsHost: Mock<HttpArgumentsHost>;
	let rpcArgumentsHost: Mock<RpcArgumentsHost>;
	let response: Mock<Response>;
	let status: HttpStatus;
	let logger: Mock<Logger>;
	let responseBody: unknown;

	beforeEach(() => {
		status = HttpStatus.I_AM_A_TEAPOT;
		responseBody = null;

		argumentsHost = new Mock<ArgumentsHost>();
		httpArgumentsHost = new Mock<HttpArgumentsHost>();
		response = new Mock<Response>();

		logger = new Mock<Logger>();
		logger.setup((m) => m.error(It.IsAny())).returns(undefined);
		logger.setup((m) => m.info(It.IsAny())).returns(undefined);

		argumentsHost.setup((m) => m.switchToHttp()).returns(httpArgumentsHost.object());
		argumentsHost.setup((m) => m.getType()).returns(undefined);
		httpArgumentsHost.setup((m) => m.getResponse()).returns(response.object());
		response
			.setup((m) => m.status(It.IsAny<number>()))
			.callback((s) => {
				status = s.args[0];
				return response.object();
			});
		response
			.setup((m) => m.json(It.IsAny()))
			.callback((s) => {
				responseBody = s.args[0];
				return response.object();
			});
		response.setup((r) => r.getHeader(It.IsAny())).returns(It.IsAny());

		const errorMapper: Mock<ErrorCodesMapper> = new Mock();
		errorMapper.setup((m) => m.mapError(It.IsAny())).returns(HttpStatus.NOT_FOUND);

		uut = new CustomExceptionsFilter(logger.object(), errorMapper.object());
		rpcArgumentsHost = new Mock<RpcArgumentsHost>();
	});

	it('should map http status.', () => {
		//Arrange
		const err = new EntityNotFound('1');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(status).equal(HttpStatus.NOT_FOUND);
	});

	it('should return simple response body.', () => {
		//Arrange
		const err = new EntityNotFound('1', CountryCodeEnum.AR);

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).deep.equal({
			code: ErrorCodesEnum.ENTITY_NOT_FOUND,
			message: `1 was not found in ${CountryCodeEnum.AR}.`,
		});
	});

	it('should return complete response body.', () => {
		//Arrange
		const err = new BadRequestException(['msg 1', 'msg 2']);

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).deep.equal({
			code: ErrorCodesEnum.VALIDATION_ERROR,
			message: 'validation error',
			errors: ['msg 1', 'msg 2'],
		});
	});

	it('should return default response body.', () => {
		//Arrange
		const err = new Error('random error');

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).deep.equal({
			message: 'internal server error',
		});
	});

	it('should return rpc status error.', () => {
		//Arrange
		const err = new Error('random error');
		argumentsHost.setup((m) => m.switchToRpc()).returns(rpcArgumentsHost.object());
		argumentsHost.setup((m) => m.getType()).returns('rmq');
		response.setup((m) => m.end()).returns(It.IsAny());

		//Act
		uut.catch(err, argumentsHost.object());

		//Assert
		expect(responseBody).deep.equal({
			message: 'internal server error',
		});
	});
});
