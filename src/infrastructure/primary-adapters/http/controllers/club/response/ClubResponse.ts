import { ApiProperty } from '@nestjs/swagger';
import { formatDate } from 'src/application/utils/DateFormat';
import { Club } from 'src/domain/entities/Club';

export class ClubResponse {
	@ApiProperty({ type: 'string', example: '9c81aa75-9117-11ed-b879-0242ac180006' })
	public id: string;

	@ApiProperty({ type: 'string', example: 'Racing Club' })
	public name: string;

	@ApiProperty({ type: 'string', format: 'date-time', example: '1903-04-25' })
	public foundationDate: string;

	@ApiProperty({ type: 'string', example: 'Argentina' })
	public country: string;

	constructor(club: Club) {
		this.id = club.uuid;
		this.name = club.name;
		this.foundationDate = formatDate(club.foundationDate);
		this.country = club.country.name;
	}
}
