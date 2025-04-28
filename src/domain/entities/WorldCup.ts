import { Country } from './Country';
import { Player } from './Player';

export class WorldCup {
	public id: number;
	public uuid: string;
	public petName: string;
	public startDate: Date;
	public finishDate: Date;
	public year: string;
	public location?: Country;
	public players?: Player[];
	public participants?: Country[];
}
