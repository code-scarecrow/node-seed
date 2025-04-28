import { Country } from './Country';
import { Player } from './Player';

export class Club {
	public id: number;
	public uuid: string;
	public name: string;
	public foundationDate: Date;
	public country: Country;
	public players: Player[];
	public createdAt: Date;
	public updatedAt: Date;
}
