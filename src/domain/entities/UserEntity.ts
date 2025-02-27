import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'uuid', name: 'uuid', nullable: false })
	public uuid: string;

	@Column({ type: 'varchar', name: 'name', length: 30 })
	public name: string;

	@Column({ type: 'varchar', name: 'lastname', length: 100 })
	public lastname: string;

	@Column({ type: 'varchar', name: 'dni', length: 9, unique: true })
	public dni: string;

	@Column({ type: 'varchar', name: 'email', length: 100, unique: true })
	public email: string;

	@Column({ type: 'varchar', name: 'passsword' })
	public password: string;

	@Column({ type: 'datetime', name: 'birth_date' })
	public birthDate: Date;
}
