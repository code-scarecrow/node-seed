import { BaseError } from '@code-scarecrow/base';
import { ErrorCodesEnum } from './ErrorCodesEnum';

export class DuplicatedEntity extends BaseError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.DUPLICATED_ENTITY, `${entityName} is duplicated.`);
	}
}
