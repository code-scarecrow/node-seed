import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { formatDate } from 'src/application/utils/DateFormat';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PositionEnum } from 'src/domain/enums/PositionEnum';

export class PlayerResponse {
	@ApiProperty({ type: 'string', example: '8cc536da-9056-11ed-923d-0242ac180003' })
	public id: string;

	@ApiProperty({ type: 'string', example: 'Lionel' })
	public name: string;

	@ApiProperty({ type: 'string', example: 'Messi' })
	public lastname: string;

	@ApiProperty({ type: 'string', format: 'date', example: '1987-06-24' })
	public birthDate: string;

	@ApiProperty({ enum: PositionEnum, example: PositionEnum.GK })
	public position: PositionEnum;

	@ApiPropertyOptional({ type: 'string', example: 'Argentina' })
	public country?: string;

	@ApiPropertyOptional({ type: 'string', example: 'Paris Saint-Germain' })
	public club?: string;

	@ApiProperty({ type: 'string', format: 'date-time', example: '2023-01-10 18:33:57' })
	public createdAt: string;

	@ApiProperty({ type: 'string', format: 'date-time', example: '2023-01-10 18:33:57' })
	public updatedAt: string;

	constructor(player: PlayerEntity) {
		this.id = player.uuid;
		this.name = player.name;
		this.lastname = player.lastname;
		if (player.country) this.country = player.country.name;
		if (player.club) this.club = player.club.name;
		this.birthDate = formatDate(player.birthDate);
		this.position = player.position;
		this.createdAt = player.createdAt.toDateString();
		this.updatedAt = player.updatedAt.toDateString();
	}
}
