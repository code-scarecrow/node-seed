import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsDateString, MaxLength, IsEmail, NotContains } from 'class-validator';
import { UserEntity } from 'src/domain/entities/UserEntity';

export class UserRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'pepe' })
	public name: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'argento' })
	public lastname: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: '34543123' })
	public dni: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	@NotContains('+')
	@ApiProperty({ type: 'string', format: 'email', example: 'test@test.com' })
	public email: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', format: 'password', example: 'asde123qas' })
	public password: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date', example: '2000-02-12' })
	public birthDate: string;

	public toEntity(): Omit<UserEntity, 'id' | 'uuid'> {
		const user = new UserEntity();
		user.name = this.name;
		user.lastname = this.lastname;
		user.dni = this.dni;
		user.email = this.email;
		user.password = this.password;
		user.birthDate = new Date(this.birthDate);

		return user;
	}
}
