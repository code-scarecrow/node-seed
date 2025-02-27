import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { PositionEnum } from '../enums/PositionEnum';
import { ClubEntity } from './ClubEntity';
import { CountryEntity } from './CountryEntity';
import { WorldCupEntity } from './WorldCupEntity';

@Entity('players')
export class PlayerEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'uuid', name: 'uuid', generated: 'uuid' })
	public uuid: string;

	@Column({ type: 'varchar', name: 'name', length: 30 })
	public name: string;

	@Column({ type: 'varchar', name: 'lastname', length: 100 })
	public lastname: string;

	@Column({ type: 'datetime', name: 'birth_date' })
	public birthDate: Date;

	@Column({ type: 'enum', name: 'position', enum: PositionEnum })
	public position: PositionEnum;

	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	public updatedAt: Date;

	@ManyToOne(() => ClubEntity, (club) => club.players)
	@JoinColumn({ name: 'club_id', referencedColumnName: 'id' })
	public club?: ClubEntity;

	@ManyToOne(() => CountryEntity, (country) => country.players)
	@JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
	public country?: CountryEntity;

	@ManyToMany(() => WorldCupEntity, (worldCup) => worldCup.players)
	@JoinTable()
	public worldCups?: WorldCupEntity[];
}
