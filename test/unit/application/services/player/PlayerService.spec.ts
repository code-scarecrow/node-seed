import { It, Mock, Times } from 'moq.ts';
import { IPlayerRepository, PlayerCreation } from 'src/application/interfaces/IPlayerRepository';
import { ClubService } from 'src/application/services/ClubService';
import { CountryService } from 'src/application/services/CountryService';
import { PlayerService } from 'src/application/services/PlayerService';
import { Club } from 'src/domain/entities/Club';
import { Player } from 'src/domain/entities/Player';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';

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
		const country = domainMocks.getCountry();
		const club = new Mock<Club>().object();
		const playerCreation: Omit<PlayerCreation, 'clubId' | 'countryId'> = {
			name: faker.person.firstName(),
			birthDate: new Date(),
			lastname: faker.person.lastName(),
			position: PositionEnum.GK,
		};

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		clubService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(club);
		playerRepository.setup((m) => m.create(It.IsAny<PlayerCreation>())).returnsAsync(It.IsAny<Player>());

		//Act
		await playerService.create(country.uuid, club.uuid, playerCreation);

		//Assert
		playerRepository.verify(
			(m) => m.create(It.Is<PlayerCreation>((p) => p.countryId == country.id && p.clubId == club.id)),
			Times.Once(),
		);
	});

	it('should update a player.', async () => {
		//Arrange
		const playerCreation: Omit<PlayerCreation, 'clubId' | 'countryId'> = {
			name: faker.person.firstName(),
			birthDate: new Date(),
			lastname: faker.person.lastName(),
			position: PositionEnum.GK,
		};
		const player = domainMocks.getPlayer(playerCreation);

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player.country);
		clubService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player.club);
		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);
		playerRepository.setup((m) => m.update(It.IsAny(), It.IsAny())).returnsAsync(player);

		//Act
		const res = await playerService.update(player.uuid, player.country.uuid, player.club.uuid, playerCreation);

		//Assert
		expect(res).to.be.deep.equal(player);
	});

	it('should delete a player.', async () => {
		//Arrange
		const player = domainMocks.getPlayer();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);
		playerRepository.setup((m) => m.delete(It.Is<{ id: number }>((v) => v.id === player.id))).returnsAsync(undefined);

		//Act
		await playerService.delete(player.uuid);

		//Assert
		playerRepository.verify((m) => m.delete(It.Is<{ id: number }>((v) => v.id === player.id)), Times.Once());
	});

	it('should find a player by uuid return an entity.', async () => {
		//Arrange
		const player = domainMocks.getPlayer();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(player);

		//Act
		const response = await playerService.findByUuid(player.uuid);

		//Assert
		expect(response).to.be.deep.equal(player);
	});

	it('should find a player by uuid throw error.', async () => {
		//Arrange
		const player = new Mock<Player>().object();

		playerRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = playerService.findByUuid(player.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('Player was not found.');

		playerRepository.verify((m) => m.findByUuid(player.uuid), Times.Once());
	});

	it('should return all players.', async () => {
		//Arrange
		const player = domainMocks.getPlayer();

		playerRepository.setup((m) => m.findAll()).returnsAsync([player]);

		//Act
		const response = await playerService.findAll();

		//Assert
		expect(response).to.be.deep.equal([player]);
	});
});
