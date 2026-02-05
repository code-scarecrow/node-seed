import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorCodesMapperBase<T> {
	protected errorMapper: Map<T, HttpStatus>;

	constructor() {
		this.errorMapper = new Map();
	}

	public mapError(code: T): HttpStatus {
		const status = this.errorMapper.get(code);
		if (!status) throw new Error('Error code not mapped');
		return status;
	}
}
