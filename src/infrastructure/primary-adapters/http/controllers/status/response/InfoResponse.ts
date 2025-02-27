import { ApiProperty } from '@nestjs/swagger';

export class InfoResponse {
	@ApiProperty({ type: 'string', example: 'test' })
	public name: string;

	@ApiProperty({ type: 'string', example: '1.0.0' })
	public version: string;

	@ApiProperty({ type: 'string', example: '1.0.0' })
	public seedVersion: string;

	constructor(name: string, version: string, seedVersion: string) {
		this.name = name;
		this.version = version;
		this.seedVersion = seedVersion;
	}
}
