import { BaseError } from '@code-scarecrow/base';
import { CountryCodeEnum } from '../enums/CountryCodeEnum';
import { ErrorCodesEnum } from './ErrorCodesEnum';

export class EntityNotFound extends BaseError<ErrorCodesEnum> {
	constructor(entityName: string, countryCode?: CountryCodeEnum) {
		super(ErrorCodesEnum.ENTITY_NOT_FOUND, `${entityName} was not found` + (countryCode ? ` in ${countryCode}.` : '.'));
	}
}
