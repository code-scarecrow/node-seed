import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsNumber } from 'class-validator';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { RabbitRacesEnum } from 'src/domain/enums/RabbitRaces';

export class RabbitRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', default: 'pepe' })
	public name: string;

	@IsNotEmpty()
	@IsNumber()
	@ApiProperty({ type: 'number', default: '0' })
	public age: number;

	@IsNotEmpty()
	@IsEnum(RabbitRacesEnum, {
		message: 'race should be one of American, Belgian Hare, Blanc de Hotot, Californian Rabbits, Harlequin',
	})
	@ApiProperty({ enum: RabbitRacesEnum, default: RabbitRacesEnum.AMERICAN })
	public race: RabbitRacesEnum;

	public toEntity(): Rabbit {
		const rabbit = new Rabbit();
		rabbit.name = this.name;
		rabbit.age = this.age;
		rabbit.race = this.race;

		return rabbit;
	}
}
