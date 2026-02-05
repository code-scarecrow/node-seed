import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { ErrorCodesMapperBase } from './ErrorCodesMapperBase';
import { ErrorResponse } from './ErrorResponse';
import { BaseComplexError } from './BaseComplexError';
import { BaseError } from './BaseError';
import { Logger, parseNestResponse } from '../../logger';

@Catch()
export class ExceptionsFilter<T> implements ExceptionFilter {
	private readonly logger: Logger;
	private readonly errorCodesMapper: ErrorCodesMapperBase<T>;
	protected errorMapper: ((exception: unknown, response: Response) => boolean)[];

	constructor(logger: Logger, errorMapper: ErrorCodesMapperBase<T>) {
		this.logger = logger;
		this.errorCodesMapper = errorMapper;
		this.errorMapper = [];

		this.errorMapper.push((exception: unknown, response: Response) => this.errorHandlerBase(exception, response));
		this.errorMapper.push((exception: unknown, response: Response) => this.notFoundErrorHandler(exception, response));
	}

	public catch(exception: unknown, host: ArgumentsHost): void {
		const context: HttpArgumentsHost = host.switchToHttp();
		const response: Response = context.getResponse<Response>();

		if ('rmq' === `${host.getType()}`) {
			this.logger.error((exception as Error).message);
			response.end();
		}

		for (const errorMap of this.errorMapper) {
			if (errorMap(exception, response)) return;
		}

		this.logger.error((exception as Error).message);
		this.resolveResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, { message: 'internal server error' });
	}

	protected resolveResponse(res: Response, status: HttpStatus, body: unknown): void {
		const metadata = parseNestResponse(status, body);
		this.logger.info('Internal response - Error', metadata, this.getTraceId(res));
		res.status(status).json(body);
	}

	private getTraceId(res: Response): string | undefined {
		const trace = res.getHeader('x-trace-id');

		if (Array.isArray(trace) || !trace) return undefined;

		return trace + '';
	}

	private errorHandlerBase(exception: unknown, response: Response): boolean {
		if (!(exception instanceof BaseError)) return false;

		const httpStatus = this.errorCodesMapper.mapError(exception.code);
		if (exception instanceof BaseComplexError) {
			this.resolveResponse(
				response,
				httpStatus,
				new ErrorResponse<T>(exception.code, exception.message, exception.errors),
			);
		} else {
			this.resolveResponse(response, httpStatus, new ErrorResponse(exception.code, exception.message));
		}
		return true;
	}

	private notFoundErrorHandler(exception: unknown, response: Response): boolean {
		if (!(exception instanceof NotFoundException)) return false;

		this.resolveResponse(response, HttpStatus.NOT_FOUND, new ErrorResponse(HttpStatus.NOT_FOUND, exception.message));

		return true;
	}
}
