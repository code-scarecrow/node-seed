import { It, Mock } from 'moq.ts';
import { CountryRepository } from 'src/infrastructure/secondary-adapters/database/repositories/CountryRepository';
import { expect } from 'chai';
import { PrismaService } from 'src/infrastructure/secondary-adapters/database/client/PrismaService';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';
import { prismaMocks } from '../mocks/PrismaMocks';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

describe('Country Repository Test.', () => {
	let countryRepository: CountryRepository;
	let repo: Mock<Prisma.countriesDelegate<DefaultArgs>>;

	beforeEach(() => {
		const prisma: Mock<PrismaService> = new Mock();

		repo = new Mock<Prisma.countriesDelegate<DefaultArgs>>();
		prisma.setup((m) => m.countries).returns(repo.object());

		countryRepository = new CountryRepository(prisma.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const country = domainMocks.getCountry();
		repo.setup((m) => m.findUnique(It.IsAny())).returnsAsync(prismaMocks.getCountry(country));

		//Act
		const result = await countryRepository.findByUuid(country.uuid);

		//Assert
		expect(result).deep.equal(country);
	});

	it('Find all by uuids.', async () => {
		//Arrange
		const country = domainMocks.getCountry();
		repo.setup((m) => m.findMany(It.IsAny())).returnsAsync([country]);

		//Act
		const result = await countryRepository.findAllByUuid([country.uuid]);

		//Assert
		expect(result).deep.equal([country]);
	});

	it('Get country with players.', async () => {
		//Arrange
		const country = domainMocks.getCountry(true);
		repo.setup((m) => m.findUnique(It.IsAny())).returnsAsync(prismaMocks.getCountry(country, true));

		//Act
		const result = await countryRepository.getCountryWithPlayers(country.uuid);

		//Assert
		expect(result).deep.equal(country);
	});
});
