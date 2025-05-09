import { User } from 'src/domain/entities/User';

export class UserCreateMessage {
	public uuid: string;
	public name: string;
	public lastname: string;
	public dni: string;
	public email: string;
	public password: string;
	public birthDate: Date;

	constructor(user: Omit<User, 'id'>) {
		this.uuid = user.uuid;
		this.name = user.name;
		this.lastname = user.lastname;
		this.dni = user.dni;
		this.email = user.email;
		this.password = user.password;
		this.birthDate = user.birthDate;
	}
}
