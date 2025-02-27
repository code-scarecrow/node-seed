import { ApiProperty } from '@nestjs/swagger';
import { formatDate } from 'src/application/utils/DateFormat';
import { UserEntity } from 'src/domain/entities/UserEntity';

export class UserResponse {
	@ApiProperty({ type: 'string', example: '8cc536da-9056-11ed-923d-0242ac180003' })
	public id: string;

	@ApiProperty({ type: 'string', example: 'Lionel' })
	public name: string;

	@ApiProperty({ type: 'string', example: 'Messi' })
	public lastname: string;

	@ApiProperty({ type: 'string', example: '36656345' })
	public dni: string;

	@ApiProperty({ type: 'string', example: 'messi@lionel.com' })
	public emial: string;

	@ApiProperty({ type: 'string', format: 'date', example: '1987-06-24' })
	public birthDate: string;

	constructor(user: UserEntity) {
		this.id = user.uuid;
		this.name = user.name;
		this.lastname = user.lastname;
		this.dni = user.dni;
		this.emial = user.email;
		this.birthDate = formatDate(user.birthDate);
	}
}
