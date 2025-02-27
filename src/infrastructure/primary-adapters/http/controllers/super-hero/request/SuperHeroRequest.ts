import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';
import { SuperHero } from 'src/domain/entities/SuperHero';

export class SuperHeroRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', default: 'Flash' })
	public name: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '30' })
	public intelligence: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '40' })
	public strength: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '100' })
	public speed: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '20' })
	public durability: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '50' })
	public power: string;

	@IsNotEmpty()
	@IsNumberString()
	@ApiProperty({ type: 'string', default: '50' })
	public combat: string;

	public toEntity(): SuperHero {
		const sh = new SuperHero();
		sh.name = this.name;
		sh.combat = this.combat;
		sh.durability = this.durability;
		sh.intelligence = this.intelligence;
		sh.power = this.power;
		sh.speed = this.speed;
		sh.strength = this.strength;

		return sh;
	}
}
