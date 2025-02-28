import { ApiProperty } from '@nestjs/swagger';
import { IsBefore } from '@code-scarecrow/base';
import { IsNotEmpty, IsString, IsUUID, Matches, IsDateString, Length } from 'class-validator';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';

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

	public toEntity(): WorldCupEntity {
		const worldCup = new WorldCupEntity();
		worldCup.petName = this.petName;
		worldCup.year = this.year;
		worldCup.startDate = new Date(this.startDate);
		worldCup.finishDate = new Date(this.finishDate);

		return worldCup;
	}
}
