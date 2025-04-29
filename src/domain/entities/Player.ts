import { PositionEnum } from '../enums/PositionEnum';
import { Club } from './Club';
import { Country } from './Country';

export class Player {
	public id: number;
	public uuid: string;
	public name: string;
	public lastname: string;
	public birthDate: Date;
	public position: PositionEnum;
	public createdAt: Date;
	public updatedAt: Date;
	public club: Club;
	public country: Country;

	public constructor(
		props: {
			id: number;
			uuid: string;
			name: string;
			lastname: string;
			birthDate: Date;
			createdAt: Date;
			updatedAt: Date;
		},
		position: PositionEnum,
		club: Club,
		country: Country,
	) {
		this.id = props.id;
		this.uuid = props.uuid;
		this.name = props.name;
		this.lastname = props.lastname;
		this.birthDate = props.birthDate;
		this.position = position;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
		this.club = club;
		this.country = country;
	}
}
