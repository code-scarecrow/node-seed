import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CountryEntity } from './CountryEntity';
import { PlayerEntity } from './PlayerEntity';

@Entity('world_cups')
export class WorldCupEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'uuid', name: 'uuid', generated: 'uuid' })
	public uuid: string;

	@Column({ type: 'varchar', name: 'pet_name', length: 30 })
	public petName: string;

	@Column({ type: 'datetime', name: 'start_date' })
	public startDate: Date;

	@Column({ type: 'datetime', name: 'finish_date' })
	public finishDate: Date;

	@Column({ type: 'varchar', name: 'year', length: 4, unique: true })
	public year: string;

	@ManyToOne(() => CountryEntity, (country) => country.hostedworldCups)
	@JoinColumn({ name: 'location_id', referencedColumnName: 'id' })
	public location?: CountryEntity;

	@ManyToMany(() => PlayerEntity, (player) => player.worldCups)
	public players?: PlayerEntity[];

	@ManyToMany(() => CountryEntity, { onDelete: 'NO ACTION' })
	@JoinTable({
		name: 'participants',
		joinColumn: {
			name: 'world_cup_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'country_id',
			referencedColumnName: 'id',
		},
	})
	public participants?: CountryEntity[];
}
