import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CountryEntity } from './CountryEntity';
import { PlayerEntity } from './PlayerEntity';

@Entity('clubs')
export class ClubEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'uuid', name: 'uuid', generated: 'uuid' })
	public uuid: string;

	@Column({ type: 'varchar', name: 'name', length: 30 })
	public name: string;

	@Column({ type: 'datetime', name: 'foundation_date' })
	public foundationDate: Date;

	@ManyToOne(() => CountryEntity, (country) => country.clubs)
	@JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
	public country: CountryEntity;

	@OneToMany(() => PlayerEntity, (player) => player.club)
	public players: PlayerEntity[];

	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	public updatedAt: Date;
}
