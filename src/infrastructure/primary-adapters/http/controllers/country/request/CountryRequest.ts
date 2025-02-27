import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CountryEntity } from 'src/domain/entities/CountryEntity';

export class CountryRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'Argentina' })
	public name: string;

	@IsNotEmpty()
	@IsString()
	@Length(3)
	@ApiProperty({ type: 'string', example: 'ARG' })
	public code: string;

	public toEntity(): CountryEntity {
		const country = new CountryEntity();
		country.name = this.name;
		country.code = this.code;

		return country;
	}
}
