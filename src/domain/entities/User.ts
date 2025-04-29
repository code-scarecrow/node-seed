export class User {
	public id: number;
	public uuid: string;
	public name: string;
	public lastname: string;
	public dni: string;
	public email: string;
	public password: string;
	public birthDate: Date;

	public constructor(props: {
		id: number;
		uuid: string;
		name: string;
		lastname: string;
		dni: string;
		email: string;
		password: string;
		birthDate: Date;
	}) {
		this.id = props.id;
		this.uuid = props.uuid;
		this.name = props.name;
		this.lastname = props.lastname;
		this.dni = props.dni;
		this.email = props.email;
		this.password = props.password;
		this.birthDate = props.birthDate;
	}
}
