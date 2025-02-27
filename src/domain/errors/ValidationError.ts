import { BaseComplexError } from '@code-scarecrow/base';
import { ErrorCodesEnum } from './ErrorCodesEnum';

export class ValidationError extends BaseComplexError<ErrorCodesEnum> {
	constructor(errors: string[]) {
		super(ErrorCodesEnum.VALIDATION_ERROR, 'validation error', errors);
	}
}
