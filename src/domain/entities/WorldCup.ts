import { Country } from './Country';

export class WorldCup {
	public id: number;
	public uuid: string;
	public petName: string;
	public startDate: Date;
	public finishDate: Date;
	public year: string;
	public location: Country;
	public participants: Country[] | undefined;

	public constructor(
		props: {
			id: number;
			uuid: string;
			petName: string;
			startDate: Date;
			finishDate: Date;
			year: string;
		},
		location: Country,
		participants?: Country[],
	) {
		this.id = props.id;
		this.uuid = props.uuid;
		this.petName = props.petName;
		this.startDate = props.startDate;
		this.finishDate = props.finishDate;
		this.year = props.year;
		this.location = location;
		this.participants = participants;
	}
}
