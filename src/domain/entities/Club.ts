import { Country } from './Country';

export class Club {
	public id: number;
	public uuid: string;
	public name: string;
	public foundationDate: Date;
	public country: Country;
	public createdAt: Date;
	public updatedAt: Date;

	constructor(
		props: {
			id: number;
			uuid: string;
			name: string;
			foundationDate: Date;
			createdAt: Date;
			updatedAt: Date;
		},
		country: Country,
	) {
		this.id = props.id;
		this.uuid = props.uuid;
		this.name = props.name;
		this.foundationDate = props.foundationDate;
		this.country = country;
		this.createdAt = props.createdAt;
		this.updatedAt = props.updatedAt;
	}
}
