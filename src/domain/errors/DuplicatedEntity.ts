import { BaseError } from 'src/base/nest/errors';
import { ErrorCodesEnum } from './ErrorCodesEnum';

export class DuplicatedEntity extends BaseError<ErrorCodesEnum> {
	constructor(entityName: string) {
		super(ErrorCodesEnum.DUPLICATED_ENTITY, `${entityName} is duplicated.`);
	}
}
