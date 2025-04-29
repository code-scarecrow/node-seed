import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CountryCreation } from 'src/application/interfaces/ICountryRepository';

export class CountryRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'Argentina' })
	public name!: string;

	@IsNotEmpty()
	@IsString()
	@Length(3)
	@ApiProperty({ type: 'string', example: 'ARG' })
	public code!: string;

	public toEntity(): CountryCreation {
		return {
			name: this.name,
			code: this.code,
		};
	}
}
