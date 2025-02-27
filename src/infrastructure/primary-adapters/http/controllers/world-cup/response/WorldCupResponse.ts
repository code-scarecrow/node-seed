import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatDate } from 'src/application/utils/DateFormat';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { CountryResponse } from '../../country/response/CountryResponse';

export class WorldCupResponse {
	@ApiProperty({ type: 'string', example: '92bdd0e6-cfcf-11ec-8efe-0242ac120006' })
	public id: string;

	@ApiProperty({ type: 'string', example: "La'eeb" })
	public petName: string;

	@ApiProperty({ type: 'string', example: '2022' })
	public year: string;

	@ApiProperty({ type: 'string', format: 'date', example: '2022-11-20' })
	public startDate: string;

	@ApiProperty({ type: 'string', format: 'date', example: '2022-12-18' })
	public finishDate: string;

	@ApiPropertyOptional({ type: 'string', example: 'Qatar' })
	public location?: string;

	@ApiPropertyOptional({
		isArray: true,
		type: CountryResponse,
		example: [
			{
				id: 'be01649c-9045-11ed-923d-0242ac180003',
				name: 'Argentina',
				code: 'ARG',
			},
			{
				id: 'be016b31-9045-11ed-923d-0242ac180003',
				name: 'France',
				code: 'FRA',
			},
		],
	})
	public participants?: CountryResponse[];

	constructor(worldCup: WorldCupEntity) {
		this.id = worldCup.uuid;
		this.petName = worldCup.petName;
		this.year = worldCup.year;
		this.startDate = formatDate(worldCup.startDate);
		this.finishDate = formatDate(worldCup.finishDate);
		if (worldCup.location) this.location = worldCup.location.name;
		if (worldCup.participants) {
			this.participants = worldCup.participants.map((participant) => new CountryResponse(participant));
		}
	}
}
