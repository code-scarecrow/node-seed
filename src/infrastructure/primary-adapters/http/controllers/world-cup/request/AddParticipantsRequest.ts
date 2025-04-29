import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class AddParticipantsRequest {
	@IsArray()
	@ArrayUnique()
	@IsUUID('all', { each: true })
	@ApiProperty({
		example: ['92bdd0e6-cfcf-11ec-8efe-0242ac120006', ' 92bdd0e6-cfcf-11ec-8efe-0242ac120007'],
		isArray: true,
		type: 'string',
		format: 'uuid',
	})
	public participants!: string[];
}
