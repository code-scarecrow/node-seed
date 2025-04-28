import { It, Mock } from 'moq.ts';
import { Club } from 'src/domain/entities/Club';
import { ClubRepository } from 'src/infrastructure/secondary-adapters/database/repositories/ClubRepository';
import { Repository, UpdateResult } from 'typeorm';
import { expect } from 'chai';

describe('Club Repository Test.', () => {
	let clubRepository: ClubRepository;
	let repo: Mock<Repository<Club>>;

	beforeEach(() => {
		repo = new Mock<Repository<Club>>();
		clubRepository = new ClubRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new Club());

		//Act
		const result = await clubRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(Club);
	});

	it('Find all with countries.', async () => {
		//Arrange
		const clubEntity = new Club();

		repo.setup((m) => m.find(It.IsAny())).returnsAsync([clubEntity]);

		//Act
		const result = await clubRepository.findAll();

		//Assert
		expect(result).deep.equal([clubEntity]);

		result.forEach((club) => {
			expect(club).instanceOf(Club);
		});
	});

	it('Call update.', async () => {
		//Arrange
		const clubEntity = new Club();
		clubEntity.id = 1;
		clubEntity.name = 'Racing Club';
		clubEntity.foundationDate = new Date('1903-04-25');

		repo.setup((m) => m.update(It.IsAny(), It.IsAny())).returnsAsync(new UpdateResult());

		//Act
		const result = await clubRepository.update({ id: clubEntity.id }, clubEntity);

		//Assert
		expect(result).instanceOf(Club);
	});
});
