import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorCodesMapperBase } from '@code-scarecrow/base';
import { ErrorCodesEnum } from 'src/domain/errors/ErrorCodesEnum';

@Injectable()
export class ErrorCodesMapper extends ErrorCodesMapperBase<ErrorCodesEnum> {
	constructor() {
		super();
		this.errorMapper.set(ErrorCodesEnum.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
		this.errorMapper.set(ErrorCodesEnum.ENTITY_NOT_FOUND, HttpStatus.NOT_FOUND);
		this.errorMapper.set(ErrorCodesEnum.DUPLICATED_ENTITY, HttpStatus.BAD_REQUEST);
	}
}
