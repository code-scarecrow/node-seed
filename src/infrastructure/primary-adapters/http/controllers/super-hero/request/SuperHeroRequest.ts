import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';
import { SuperHeroCreation } from 'src/application/interfaces/ISuperHeroRepository';

export class SuperHeroRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', default: 'Flash' })
	public name!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '30' })
	public intelligence!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '40' })
	public strength!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '100' })
	public speed!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '20' })
	public durability!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '50' })
	public power!: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '50' })
	public combat!: string;

	public toEntity(): SuperHeroCreation {
		return {
			name: this.name,
			intelligence: this.intelligence,
			strength: this.strength,
			speed: this.speed,
			durability: this.durability,
			power: this.power,
			combat: this.combat,
		};
	}
}
