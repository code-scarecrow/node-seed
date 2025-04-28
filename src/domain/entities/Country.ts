import { Club } from './Club';
import { Player } from './Player';
import { WorldCup } from './WorldCup';

export class Country {
	public id: number;
	public uuid: string;
	public name: string;
	public code: string;
	public players?: Player[];
	public clubs?: Club[];
	public hostedworldCups?: WorldCup[];
}
