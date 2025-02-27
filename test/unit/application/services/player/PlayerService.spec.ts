import { It, Mock, Times } from 'moq.ts';
import { IPlayerRepository } from 'src/application/interfaces/IPlayerRepository';
import { ClubService } from 'src/application/services/ClubService';
import { CountryService } from 'src/application/services/CountryService';
import { PlayerService } from 'src/application/services/PlayerService';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { expect } from 'chai';

describe('Player service test.', () => {
	let playerService: PlayerService;
	let playerRepository: Mock<IPlayerRepository>;
	let countryService: Mock<CountryService>;
	let clubService: Mock<ClubService>;

	beforeEach(() => {
		playerRepository = new Mock<IPlayerRepository>();
		countryService = new Mock<CountryService>();
		clubService = new Mock<ClubService>();
		playerService = new PlayerService(playerRepository.object(), countryService.object(), clubService.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(playerService).exist;
	});

	it('should create a player.', async () => {
		//Arrange
		const country = new CountryEntity();
		const club = new ClubEntity();
		const player = new PlayerEntity();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		clubService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(club);
		playerRepository.setup((m) => m.create(player)).returnsAsync(It.IsAny<PlayerEntity>());

		//Act
		await playerService.create(country.uuid, club.uuid, player);

		//Assert
		playerRepository.verify((m) => m.create(player), Times.Once());
	});

	it('should update a player.', async () => {
		//Arrange
		const country = new CountryEntity();
		const club = new ClubEntity();
		const player = new PlayerEntity();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		clubService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(club);
		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);
		playerRepository
			.setup((m) =>
				m.update(
					It.Is<{ id: number }>((v) => v.id === country.id),
					player,
				),
			)
			.returnsAsync(player);

		//Act
		await playerService.update(player.uuid, country.uuid, club.uuid, player);

		//Assert
		playerRepository.verify(
			(m) =>
				m.update(
					It.Is<{ id: number }>((v) => v.id === country.id),
					player,
				),
			Times.Once(),
		);
	});

	it('should delete a player.', async () => {
		//Arrange
		const player = new PlayerEntity();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);
		playerRepository.setup((m) => m.delete(It.Is<{ id: number }>((v) => v.id === player.id))).returnsAsync(undefined);

		//Act
		await playerService.delete(player.uuid);

		//Assert
		playerRepository.verify((m) => m.delete(It.Is<{ id: number }>((v) => v.id === player.id)), Times.Once());
	});

	it('should find a player by uuid return an entity.', async () => {
		//Arrange
		const player = new PlayerEntity();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);

		//Act
		const response = await playerService.findByUuid(player.uuid);

		//Assert
		playerRepository.verify((m) => m.findByUuid(player.uuid), Times.Once());

		expect(response).instanceOf(PlayerEntity);
	});

	it('should find a player by uuid throw error.', async () => {
		//Arrange
		const player = new PlayerEntity();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = playerService.findByUuid(player.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('Player was not found.');

		playerRepository.verify((m) => m.findByUuid(player.uuid), Times.Once());
	});

	it('should return all players.', async () => {
		//Arrange
		const player = new PlayerEntity();

		playerRepository.setup((m) => m.findAll()).returnsAsync([player]);

		//Act
		const response = await playerService.findAll();

		//Assert
		playerRepository.verify((m) => m.findAll(), Times.Once());

		response.map((country) => expect(country).instanceOf(PlayerEntity));
	});
});
