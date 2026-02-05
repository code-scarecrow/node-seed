import { BaseError } from './BaseError';

export abstract class BaseComplexError<T> extends BaseError<T> {
	public errors: string[];

	constructor(code: T, message: string, errors: string[]) {
		super(code, message);
		this.errors = errors;
	}
}
