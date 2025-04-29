import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Matches, IsDateString, IsEnum } from 'class-validator';
import { PlayerCreation } from 'src/application/interfaces/IPlayerRepository';
import { PositionEnum } from 'src/domain/enums/PositionEnum';

export class PlayerRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string' })
	public name!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string' })
	public lastname!: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date', example: '2000-02-12' })
	public birthDate!: string;

	@IsEnum(PositionEnum, {
		message: `position should be one of ${Object.values(PositionEnum)}`,
	})
	@ApiProperty({ enum: PositionEnum, example: PositionEnum.GK })
	public position!: PositionEnum;

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty({ type: 'string', format: 'uuid' })
	public clubId!: string;

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty({ type: 'string', format: 'uuid' })
	public countryId!: string;

	public toEntity(): Omit<PlayerCreation, 'clubId' | 'countryId'> {
		return {
			name: this.name,
			lastname: this.lastname,
			birthDate: new Date(this.birthDate),
			position: this.position,
		};
	}
}
