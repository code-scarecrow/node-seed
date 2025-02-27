import { BadRequestException, Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'src/domain/errors/ValidationError';
import { ErrorCodesMapper } from './ErrorCodesMapper';
import { Logger } from '@code-scarecrow/base/logger';
import { ErrorCodesEnum } from 'src/domain/errors/ErrorCodesEnum';
import { ErrorResponse, ExceptionsFilter } from '@code-scarecrow/base';

@Catch()
export class CustomExceptionsFilter extends ExceptionsFilter<ErrorCodesEnum> {
	constructor(logger: Logger, errorMapper: ErrorCodesMapper) {
		super(logger, errorMapper);

		this.errorMapper.push((exception: unknown, response: Response) => {
			if (!(exception instanceof BadRequestException)) return false;

			const error = new ValidationError((exception.getResponse() as { message: string[] }).message);
			this.resolveResponse(
				response,
				HttpStatus.BAD_REQUEST,
				new ErrorResponse(error.code, error.message, error.errors),
			);
			return true;
		});
	}
}
