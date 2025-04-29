import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, IsDateString, MaxLength, IsEmail, NotContains } from 'class-validator';
import { User } from 'src/domain/entities/User';

export class UserRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'pepe' })
	public name!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: 'argento' })
	public lastname!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', example: '34543123' })
	public dni!: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(100)
	@NotContains('+')
	@ApiProperty({ type: 'string', format: 'email', example: 'test@test.com' })
	public email!: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty({ type: 'string', format: 'password', example: 'asde123qas' })
	public password!: string;

	@IsNotEmpty()
	@IsDateString()
	@Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
		message: '$property must be formatted as yyyy-mm-dd',
	})
	@ApiProperty({ type: 'string', format: 'date', example: '2000-02-12' })
	public birthDate!: string;

	public toEntity(): Omit<User, 'id' | 'uuid'> {
		return {
			name: this.name,
			lastname: this.lastname,
			dni: this.dni,
			email: this.email,
			password: this.password,
			birthDate: new Date(this.birthDate),
		};
	}
}
