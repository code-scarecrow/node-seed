import { It, Mock } from 'moq.ts';
import { PlayerEntity } from 'src/domain/entities/PlayerEntity';
import { PlayerRepository } from 'src/infrastructure/secondary-adapters/database/repositories/PlayerRepository';
import { Repository, UpdateResult } from 'typeorm';
import { expect } from 'chai';

describe('Player Repository Test.', () => {
	let playerRepository: PlayerRepository;
	let repo: Mock<Repository<PlayerEntity>>;

	beforeEach(() => {
		repo = new Mock<Repository<PlayerEntity>>();
		playerRepository = new PlayerRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new PlayerEntity());

		//Act
		const result = await playerRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(PlayerEntity);
	});

	it('Call update.', async () => {
		//Arrange
		const playerEntity = new PlayerEntity();
		playerEntity.id = 1;
		playerEntity.name = 'Lionel';
		playerEntity.lastname = 'Messi';

		repo.setup((m) => m.update(It.IsAny(), It.IsAny())).returnsAsync(new UpdateResult());

		//Act
		const result = await playerRepository.update({ id: playerEntity.id }, playerEntity);

		//Assert
		expect(result).instanceOf(PlayerEntity);
	});
});
