import { RabbitRacesEnum } from '../enums/RabbitRaces';

export class Rabbit {
	public id: string;
	public name: string;
	public age: number;
	public race: RabbitRacesEnum;

	public constructor(id: string, name: string, age: number, race: RabbitRacesEnum) {
		this.id = id;
		this.name = name;
		this.age = age;
		this.race = race;
	}
}
