import { ApiProperty } from '@nestjs/swagger';
import { IsBefore } from '@code-scarecrow/base';
import { IsNotEmpty, IsString, IsUUID, Matches, IsDateString, Length } from 'class-validator';
import { WorldCupCreation } from 'src/application/interfaces/IWorldCupRepository';

export class WorldCupRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'argento' })
	public petName: string;

	@IsNotEmpty()
	@IsString()
	@Length(4)
	@Matches(/^\d{4}$/i, {
		message: '$property must be formatted as yyyy',
	})
	@ApiProperty({ type: 'string', example: '2022' })
	public year: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date' })
	@IsBefore('finishDate')
	public startDate: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date' })
	public finishDate: string;

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty({ type: 'string', format: 'uuid' })
	public countryId: string;

	public toEntity(): Omit<WorldCupCreation, 'locationId'> {
		return {
			petName: this.petName,
			year: this.year,
			startDate: new Date(this.startDate),
			finishDate: new Date(this.finishDate),
		};
	}
}
