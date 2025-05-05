import { It, Mock } from 'moq.ts';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { WorldCupRepository } from 'src/infrastructure/secondary-adapters/database/repositories/WorldCupRepository';
import { expect } from 'chai';
import { PrismaService } from 'src/infrastructure/secondary-adapters/database/client/PrismaService';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { prismaMocks } from '../mocks/PrismaMocks';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';

describe('WorldCup Repository Test.', () => {
	let clubRepository: WorldCupRepository;
	let wcRepo: Mock<Prisma.world_cupsDelegate<DefaultArgs>>;

	beforeEach(() => {
		const repo: Mock<PrismaService> = new Mock();

		wcRepo = new Mock<Prisma.world_cupsDelegate<DefaultArgs>>();
		repo.setup((m) => m.world_cups).returns(wcRepo.object());

		clubRepository = new WorldCupRepository(repo.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		wcRepo
			.setup((m) =>
				m.findUnique<{
					where: { id: number };
					include: { countries: true };
				}>(It.IsAny()),
			)
			.returnsAsync(prismaMocks.getWorldCup(domainMocks.getWorldCup()));

		//Act
		const result = await clubRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(WorldCup);
	});

	it('Find one With Participants.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';
		wcRepo
			.setup((m) =>
				m.findUnique<{
					where: { id: number };
					include: { countries: true; participants: { include: { countries: true } } };
				}>(It.IsAny()),
			)
			.returnsAsync({
				...prismaMocks.getWorldCup(domainMocks.getWorldCup()),
				participants: [
					{
						countryId: 1,
						worldCupId: 1,
						countries: {
							id: 1,
							name: 'asd',
							uuid: '',
							code: '',
						},
					},
				],
			});

		//Act
		const result = await clubRepository.findOneWithParticipants(uuid);

		//Assert
		expect(result).instanceOf(WorldCup);
	});

	it('Find all.', async () => {
		//Arrange
		wcRepo
			.setup((m) => m.findMany<{ include: { countries: true } }>(It.IsAny()))
			.returnsAsync([prismaMocks.getWorldCup(domainMocks.getWorldCup())]);

		//Act
		const result = await clubRepository.findAll();

		//Assert
		result.map((club) => expect(club).instanceOf(WorldCup));
	});
});
