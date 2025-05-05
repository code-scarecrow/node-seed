import { It, Mock } from 'moq.ts';
import { ClubRepository } from 'src/infrastructure/secondary-adapters/database/repositories/ClubRepository';
import { expect } from 'chai';
import { ClubCreation } from 'src/application/interfaces/IClubRepository';
import { PrismaService } from 'src/infrastructure/secondary-adapters/database/client/PrismaService';
import { faker } from '@faker-js/faker';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';
import { prismaMocks } from '../mocks/PrismaMocks';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

describe('Club Repository Test.', () => {
	let clubRepository: ClubRepository;
	let repo: Mock<Prisma.clubsDelegate<DefaultArgs>>;

	beforeEach(() => {
		const prisma: Mock<PrismaService> = new Mock();

		repo = new Mock<Prisma.clubsDelegate<DefaultArgs>>();
		prisma.setup((m) => m.clubs).returns(repo.object());

		clubRepository = new ClubRepository(prisma.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const club = domainMocks.getClub();
		repo.setup((m) => m.findUnique(It.IsAny())).returnsAsync(prismaMocks.getClub(club));

		//Act
		const result = await clubRepository.findByUuid(club.uuid);

		//Assert
		expect(result).to.be.deep.equal(club);
	});

	it('Find all with countries.', async () => {
		//Arrange
		const club = domainMocks.getClub();
		repo.setup((m) => m.findMany(It.IsAny())).returnsAsync([prismaMocks.getClub(club)]);

		//Act
		const result = await clubRepository.findAll();

		//Assert
		expect(result).deep.equal([club]);
	});

	it('Call update.', async () => {
		//Arrange
		const clubCreation: ClubCreation = {
			name: faker.company.name(),
			foundationDate: faker.date.past(),
			countryId: faker.number.int(),
		};
		const club = domainMocks.getClub(clubCreation);
		repo.setup((m) => m.update(It.IsAny())).returnsAsync(prismaMocks.getClub(club));

		//Act
		const result = await clubRepository.update({ id: 1 }, clubCreation);

		//Assert
		expect(result).to.be.deep.equal(club);
	});
});
