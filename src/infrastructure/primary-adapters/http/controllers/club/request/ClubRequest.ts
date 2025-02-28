import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { ClubEntity } from 'src/domain/entities/ClubEntity';

export class ClubRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'Argentina' })
	public name: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date', example: '1904-11-30' })
	public foundationDate: string;

	@IsNotEmpty()
	@IsUUID()
	@ApiProperty({ type: 'string', format: 'uuid' })
	public countryId: string;

	public toEntity(): ClubEntity {
		const club = new ClubEntity();
		club.name = this.name;
		club.foundationDate = new Date(this.foundationDate);

		return club;
	}
}
