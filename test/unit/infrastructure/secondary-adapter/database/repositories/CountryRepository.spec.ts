import { It, Mock } from 'moq.ts';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { CountryRepository } from 'src/infrastructure/secondary-adapters/database/repositories/CountryRepository';
import { Repository } from 'typeorm';
import { expect } from 'chai';

describe('Country Repository Test.', () => {
	let countryRepository: CountryRepository;
	let repo: Mock<Repository<CountryEntity>>;

	beforeEach(() => {
		repo = new Mock<Repository<CountryEntity>>();
		countryRepository = new CountryRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOneBy(It.IsAny())).returnsAsync(new CountryEntity());

		//Act
		const result = await countryRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(CountryEntity);
	});

	it('Find all by uuids.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';
		const clubEntity = new CountryEntity();

		repo.setup((m) => m.find(It.IsAny())).returnsAsync([clubEntity]);

		//Act
		const result = await countryRepository.findAllByUuid([uuid]);

		//Assert
		expect(result).deep.equal([clubEntity]);

		result.forEach((club) => {
			expect(club).instanceOf(CountryEntity);
		});
	});

	it('Get country with players.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new CountryEntity());

		//Act
		const result = await countryRepository.getCountryWithPlayers(uuid);

		//Assert
		expect(result).instanceOf(CountryEntity);
	});
});
