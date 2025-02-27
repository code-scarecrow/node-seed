import { It, Mock } from 'moq.ts';
import { ClubEntity } from 'src/domain/entities/ClubEntity';
import { ClubRepository } from 'src/infrastructure/secondary-adapters/database/repositories/ClubRepository';
import { Repository, UpdateResult } from 'typeorm';
import { expect } from 'chai';

describe('Club Repository Test.', () => {
	let clubRepository: ClubRepository;
	let repo: Mock<Repository<ClubEntity>>;

	beforeEach(() => {
		repo = new Mock<Repository<ClubEntity>>();
		clubRepository = new ClubRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new ClubEntity());

		//Act
		const result = await clubRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(ClubEntity);
	});

	it('Find all with countries.', async () => {
		//Arrange
		const clubEntity = new ClubEntity();

		repo.setup((m) => m.find(It.IsAny())).returnsAsync([clubEntity]);

		//Act
		const result = await clubRepository.findAll();

		//Assert
		expect(result).deep.equal([clubEntity]);

		result.forEach((club) => {
			expect(club).instanceOf(ClubEntity);
		});
	});

	it('Call update.', async () => {
		//Arrange
		const clubEntity = new ClubEntity();
		clubEntity.id = 1;
		clubEntity.name = 'Racing Club';
		clubEntity.foundationDate = new Date('1903-04-25');

		repo.setup((m) => m.update(It.IsAny(), It.IsAny())).returnsAsync(new UpdateResult());

		//Act
		const result = await clubRepository.update({ id: clubEntity.id }, clubEntity);

		//Assert
		expect(result).instanceOf(ClubEntity);
	});
});
