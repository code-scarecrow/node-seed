export abstract class BaseError<T> extends Error {
	public code: T;

	constructor(code: T, message: string) {
		super(message);
		this.code = code;
	}
}
