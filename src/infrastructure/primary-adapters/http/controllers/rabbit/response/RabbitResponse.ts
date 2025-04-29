import { ApiProperty } from '@nestjs/swagger';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { RabbitRacesEnum } from 'src/domain/enums/RabbitRaces';

export class RabbitResponse {
	@ApiProperty({ type: 'string', example: '05835e2e-6baa-4a9a-ba3c-766426b6ea9a' })
	public id: string;

	@ApiProperty({ type: 'string', example: 'Roger Rabbit' })
	public name: string;

	@ApiProperty({ type: 'number', example: 5 })
	public age: number;

	@ApiProperty({ enum: RabbitRacesEnum, example: RabbitRacesEnum.BELGIAN })
	public race: RabbitRacesEnum;

	constructor(rabbit: Rabbit) {
		this.id = rabbit.id;
		this.name = rabbit.name;
		this.age = rabbit.age;
		this.race = rabbit.race;
	}
}
