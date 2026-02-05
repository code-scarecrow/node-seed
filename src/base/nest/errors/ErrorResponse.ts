import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponse<T> {
	@ApiProperty({ type: 'string', example: '00001' })
	public code: T;
	@ApiProperty({ type: 'string', example: 'validation error' })
	public message: string;
	@ApiPropertyOptional({ isArray: true, type: String, example: ["The 'startDate' must be before the 'finishDate'"] })
	public errors?: string[];

	constructor(code: T, message: string, errors?: string[]) {
		this.code = code;
		this.message = message;
		if (errors) this.errors = errors;
	}
}
