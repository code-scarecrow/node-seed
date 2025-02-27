import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantsResponse {
	@ApiProperty({ example: 'Participants added successfully.' })
	public message: string;

	constructor() {
		this.message = 'Participants added successfully.';
	}
}
