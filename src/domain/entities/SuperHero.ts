export class SuperHero {
	public id: number;
	public name: string;
	public intelligence: string;
	public strength: string;
	public speed: string;
	public durability: string;
	public power: string;
	public combat: string;

	public constructor(
		id: number,
		name: string,
		intelligence: string,
		strength: string,
		speed: string,
		durability: string,
		power: string,
		combat: string,
	) {
		this.id = id;
		this.name = name;
		this.intelligence = intelligence;
		this.strength = strength;
		this.speed = speed;
		this.durability = durability;
		this.power = power;
		this.combat = combat;
	}
}
