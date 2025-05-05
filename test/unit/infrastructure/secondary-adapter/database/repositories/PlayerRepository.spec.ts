import { It, Mock } from 'moq.ts';
import { PlayerRepository } from 'src/infrastructure/secondary-adapters/database/repositories/PlayerRepository';
import { expect } from 'chai';
import { PrismaService } from 'src/infrastructure/secondary-adapters/database/client/PrismaService';
import { PlayerCreation } from 'src/application/interfaces/IPlayerRepository';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';
import { prismaMocks } from '../mocks/PrismaMocks';

describe('Player Repository Test.', () => {
	let playerRepository: PlayerRepository;
	let repo: Mock<Prisma.playersDelegate<DefaultArgs>>;

	beforeEach(() => {
		//TODO - unify prisma repo mock creation
		repo = new Mock<Prisma.playersDelegate<DefaultArgs>>();

		const prisma: Mock<PrismaService> = new Mock();
		prisma.setup((m) => m.players).returns(repo.object());

		playerRepository = new PlayerRepository(prisma.object());
	});

	it('Find one by uuid.', async () => {
		//Arrange
		const player = domainMocks.getPlayer();
		repo.setup((m) => m.findUnique(It.IsAny())).returnsAsync(prismaMocks.getPlayer(player));

		//Act
		const result = await playerRepository.findByUuid(player.uuid);

		//Assert
		expect(result).to.be.deep.equal(player);
	});

	it('Call update.', async () => {
		//Arrange
		const playerCreation: PlayerCreation = {
			name: 'Lionel',
			lastname: 'Messi',
			birthDate: new Date(),
			clubId: 1,
			countryId: 1,
			position: PositionEnum.GK,
		};
		const player = domainMocks.getPlayer(playerCreation);
		repo
			.setup((m) =>
				m.update<{
					where: { id: number };
					include: { countries: true; clubs: { include: { countries: true } } };
					data: { id: number };
				}>(It.IsAny()),
			)
			.returnsAsync(prismaMocks.getPlayer(player));

		//Act
		const result = await playerRepository.update({ id: 1 }, playerCreation);

		//Assert
		expect(result).to.be.deep.equal(player);
	});
});
