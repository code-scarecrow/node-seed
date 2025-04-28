import { It, Mock } from 'moq.ts';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { WorldCupRepository } from 'src/infrastructure/secondary-adapters/database/repositories/WorldCupRepository';
import { Repository } from 'typeorm';
import { expect } from 'chai';
import { PrismaService } from 'src/infrastructure/secondary-adapters/database/client/PrismaService';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

describe('Club Repository Test.', () => {
	let clubRepository: WorldCupRepository;
	let repo: Mock<Repository<WorldCupEntity>>;
	let wcRepo: Mock<Prisma.WorldCupDelegate<DefaultArgs>>;

	beforeEach(() => {
		repo = new Mock<Repository<WorldCupEntity>>();
		const repo2: Mock<PrismaService> = new Mock();

		wcRepo = new Mock<Prisma.WorldCupDelegate<DefaultArgs>>();
		repo2.setup((m) => m.worldCup).returns(wcRepo.object());

		clubRepository = new WorldCupRepository(repo.object(), repo2.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';

		wcRepo
			.setup((m) => m.findUnique(It.IsAny()))
			.returnsAsync({
				id: 1,
				finish_date: new Date(),
				locationId: 1,
				pet_name: 'asd',
				start_date: new Date(),
				uuid: '',
				year: '2',
			});

		//Act
		const result = await clubRepository.findByUuid(uuid);

		//Assert
		expect(result).instanceOf(WorldCupEntity);
	});

	it('Find one With Participants.', async () => {
		//Arrange
		const uuid = 'c46f7322-9045-11ed-923d-0242ac180003';
		repo.setup((m) => m.findOne(It.IsAny())).returnsAsync(new WorldCupEntity());

		//Act
		const result = await clubRepository.findOneWithParticipants(uuid);

		//Assert
		expect(result).instanceOf(WorldCupEntity);
	});

	it('Find all.', async () => {
		//Arrange
		repo.setup((m) => m.find(It.IsAny())).returnsAsync([new WorldCupEntity()]);

		//Act
		const result = await clubRepository.findAll();

		//Assert
		result.map((club) => expect(club).instanceOf(WorldCupEntity));
	});

	it('Call save.', async () => {
		//Arrange
		const worldCupEntity = new WorldCupEntity();
		worldCupEntity.id = 1;
		worldCupEntity.petName = 'Striker';
		worldCupEntity.startDate = new Date('1994-06-17');
		worldCupEntity.finishDate = new Date('1994-07-17');
		worldCupEntity.year = '1994';

		repo.setup((m) => m.save(It.IsAny())).returnsAsync(new WorldCupEntity());

		//Act
		const result = await clubRepository.save(worldCupEntity);

		//Assert
		expect(result).instanceOf(WorldCupEntity);
	});
});
