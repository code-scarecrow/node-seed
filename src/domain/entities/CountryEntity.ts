import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from './ClubEntity';
import { PlayerEntity } from './PlayerEntity';
import { WorldCupEntity } from './WorldCupEntity';

@Entity('countries')
export class CountryEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'uuid', name: 'uuid', generated: 'uuid' })
	public uuid: string;

	@Column({ type: 'varchar', name: 'name', length: 50 })
	public name: string;

	@Column({ type: 'varchar', name: 'code', length: 3 })
	public code: string;

	@OneToMany(() => PlayerEntity, (player) => player.country)
	public players?: PlayerEntity[];

	@OneToMany(() => ClubEntity, (club) => club.country)
	public clubs?: ClubEntity[];

	@OneToMany(() => WorldCupEntity, (worldCup) => worldCup.location)
	public hostedworldCups?: WorldCupEntity[];
}
