import { PositionEnum } from '../enums/PositionEnum';
import { Club } from './Club';
import { Country } from './Country';
import { WorldCup } from './WorldCup';

export class Player {
	public id: number;
	public uuid: string;
	public name: string;
	public lastname: string;
	public birthDate: Date;
	public position: PositionEnum;
	public createdAt: Date;
	public updatedAt: Date;
	public club?: Club;
	public country?: Country;
	public worldCups?: WorldCup[];
}
