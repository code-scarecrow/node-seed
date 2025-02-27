import { ApiProperty } from '@nestjs/swagger';
import { SuperHero } from 'src/domain/entities/SuperHero';

export class SuperHeroResponse {
	@ApiProperty({ type: 'number', example: '1' })
	public id: number;

	@ApiProperty({ type: 'string', example: 'Black Adam' })
	public name: string;

	@ApiProperty({ type: 'string', example: 80 })
	public intelligence: string;

	@ApiProperty({ type: 'string', example: 100 })
	public strength: string;

	@ApiProperty({ type: 'string', example: 95 })
	public speed: string;

	@ApiProperty({ type: 'string', example: 95 })
	public durability: string;

	@ApiProperty({ type: 'string', example: 100 })
	public power: string;

	@ApiProperty({ type: 'string', example: 100 })
	public combat: string;

	constructor(sh: SuperHero) {
		this.id = sh.id;
		this.name = sh.name;
		this.combat = sh.combat;
		this.durability = sh.durability;
		this.intelligence = sh.intelligence;
		this.power = sh.power;
		this.speed = sh.speed;
		this.strength = sh.strength;
	}
}
