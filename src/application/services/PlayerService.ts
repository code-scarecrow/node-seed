import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { IPlayerRepository, PLAYER_REPO } from '../interfaces/IPlayerRepository';
import { Player } from 'src/domain/entities/Player';
import { CountryService } from './CountryService';
import { ClubService } from './ClubService';

@Injectable()
export class PlayerService {
	constructor(
		@Inject(PLAYER_REPO) private readonly playerRepository: IPlayerRepository,
		private readonly countryService: CountryService,
		private readonly clubService: ClubService,
	) {}

	public async create(countryId: string, clubId: string, player: Player): Promise<Player> {
		const country = await this.countryService.findByUuid(countryId);
		const club = await this.clubService.findByUuid(clubId);
		player.country = country;
		player.club = club;

		return await this.playerRepository.create(player);
	}

	public async update(id: string, countryId: string, clubId: string, player: Player): Promise<Player> {
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

	public async findByUuid(uuid: string): Promise<Player> {
		const player = await this.playerRepository.findByUuid(uuid);

		if (!player) throw new EntityNotFound('Player');

		return player;
	}

	public async findAll(): Promise<Player[]> {
		return await this.playerRepository.findAll();
	}
}
