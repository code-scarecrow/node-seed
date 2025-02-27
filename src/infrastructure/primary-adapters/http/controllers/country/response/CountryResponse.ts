import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { PlayerResponse } from '../../player/response/PlayerResponse';

export class CountryResponse {
	@ApiProperty({ type: 'string', example: '877ad1e3-9114-11ed-b879-0242ac180006' })
	public id: string;

	@ApiProperty({ type: 'string', example: 'Argentina' })
	public name: string;

	@ApiProperty({ type: 'string', example: 'ARG' })
	public code: string;

	@ApiPropertyOptional({ type: [PlayerResponse] })
	public players?: PlayerResponse[];

	constructor(country: CountryEntity) {
		this.id = country.uuid;
		this.name = country.name;
		this.code = country.code;
		if (country.players) this.players = country.players.map((player) => new PlayerResponse(player));
	}
}
