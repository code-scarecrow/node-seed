import { It, Mock } from 'moq.ts';
import { Country } from 'src/domain/entities/Country';
import { CountryRepository } from 'src/infrastructure/secondary-adapters/database/repositories/CountryRepository';
import { Repository } from 'typeorm';
import { expect } from 'chai';

describe('Country Repository Test.', () => {
	let countryRepository: CountryRepository;
	let repo: Mock<Repository<Country>>;

	beforeEach(() => {
		repo = new Mock<Repository<Country>>();
		countryRepository = new CountryRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOneBy(It.IsAny())).returnsAsync(new Country());

		//Act
		const result = await countryRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(Country);
	});

	it('Find all by uuids.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';
		const clubEntity = new Country();

		repo.setup((m) => m.find(It.IsAny())).returnsAsync([clubEntity]);

		//Act
		const result = await countryRepository.findAllByUuid([uuid]);

		//Assert
		expect(result).deep.equal([clubEntity]);

		result.forEach((club) => {
			expect(club).instanceOf(Country);
		});
	});

	it('Get country with players.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new Country());

		//Act
		const result = await countryRepository.getCountryWithPlayers(uuid);

		//Assert
		expect(result).instanceOf(Country);
	});
});
