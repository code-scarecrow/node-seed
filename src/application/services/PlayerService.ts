import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { IPlayerRepository, PLAYER_REPO } from '../interfaces/IPlayerRepository';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { CountryService } from './CountryService';
import { ClubService } from './ClubService';

@Injectable()
export class PlayerService {
	constructor(
		@Inject(PLAYER_REPO) private playerRepository: IPlayerRepository,
		private countryService: CountryService,
		private clubService: ClubService,
	) {}

	public async create(countryId: string, clubId: string, player: PlayerEntity): Promise<PlayerEntity> {
		const country = await this.countryService.findByUuid(countryId);
		const club = await this.clubService.findByUuid(clubId);
		player.country = country;
		player.club = club;

		return await this.playerRepository.create(player);
	}

	public async update(id: string, countryId: string, clubId: string, player: PlayerEntity): Promise<PlayerEntity> {
		const country = await this.countryService.findByUuid(countryId);
		const club = await this.clubService.findByUuid(clubId);

		const playerDB = await this.findByUuid(id);
		player.uuid = playerDB.uuid;
		player.createdAt = playerDB.createdAt;
		player.country = country;
		player.club = club;

		return await this.playerRepository.update({ id: playerDB.id }, player);
	}

	public async delete(id: string): Promise<void> {
		const player = await this.findByUuid(id);

		await this.playerRepository.delete({ id: player.id });
	}

	public async findByUuid(uuid: string): Promise<PlayerEntity> {
		const player = await this.playerRepository.findByUuid(uuid);

		if (!player) throw new EntityNotFound('Player');

		return player;
	}

	public async findAll(): Promise<PlayerEntity[]> {
		return await this.playerRepository.findAll();
	}
}
