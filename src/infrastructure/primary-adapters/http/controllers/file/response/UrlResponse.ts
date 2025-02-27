import { ApiProperty } from '@nestjs/swagger';

export class UrlResponse {
	@ApiProperty({ type: 'string', example: 'https://test.com/el_test' })
	public url: string;

	constructor(url: string) {
		this.url = url;
	}
}
