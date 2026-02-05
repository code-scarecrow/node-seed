import { BaseComplexError } from 'src/base/nest/errors';
import { ErrorCodesEnum } from './ErrorCodesEnum';

export class ValidationError extends BaseComplexError<ErrorCodesEnum> {
	constructor(errors: string[]) {
		super(ErrorCodesEnum.VALIDATION_ERROR, 'validation error', errors);
	}
}
