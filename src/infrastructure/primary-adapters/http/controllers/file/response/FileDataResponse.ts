import { ApiProperty } from '@nestjs/swagger';
import { FileData } from 'src/domain/entities/FileData';

export class FileDataResponse {
	@ApiProperty({ type: 'string', example: '9c81aa75-9117-11ed-b879-0242ac180006' })
	public name: string;

	@ApiProperty({ type: 'string', example: '6 KB' })
	public size: string;

	constructor(fileData: FileData) {
		this.name = fileData.name;
		this.size = fileData.size + ' KB';
	}
}
