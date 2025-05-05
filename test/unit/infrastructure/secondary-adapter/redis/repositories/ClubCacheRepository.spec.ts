import { RedisService } from '@liaoliaots/nestjs-redis';
import { Logger } from '@code-scarecrow/base/logger';
import { expect } from 'chai';
import { Redis } from 'ioredis';
import { It, Mock, Times } from 'moq.ts';
import { Club } from 'src/domain/entities/Club';
import { ClubCacheRepository } from 'src/infrastructure/secondary-adapters/redis/repositories/ClubCacheRepository';
import { Country } from 'src/domain/entities/Country';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';

describe('ClubCacheRepository test', () => {
	let clubCacheRepository: ClubCacheRepository;
	let logger: Mock<Logger>;
	let redisService: Mock<RedisService>;
	let redisManager: Mock<Redis>;

	beforeEach(() => {
		logger = new Mock<Logger>();
		logger.setup((m) => m.error(It.IsAny())).returns(undefined);

		redisManager = new Mock<Redis>();

		redisService = new Mock<RedisService>();
		redisService.setup((rs) => rs.getOrThrow()).returns(redisManager.object());

		clubCacheRepository = new ClubCacheRepository(logger.object(), redisService.object());
	});

	it('should be defined', () => {
		expect(clubCacheRepository).exist;
	});
	//TODO - add AAA comments
	describe('getCache', () => {
		it('should get from cache', async () => {
			const club = domainMocks.getClub();
			redisManager.setup((rm) => rm.get(It.IsAny<string>())).returnsAsync(JSON.stringify(club));

			const clubFromCache = await clubCacheRepository.getCache(club.uuid);

			redisManager.verify((rm) => rm.get(It.IsAny<string>()), Times.Once());
			expect(clubFromCache).deep.equal(club);
		});

		it('should return null if not found in cache', async () => {
			const uuid = '2bedb101-012d-490a-bf6f-a801d95afc05';

			redisManager.setup((rm) => rm.get(It.IsAny<string>())).returnsAsync(null);

			const clubFromCache = await clubCacheRepository.getCache(uuid);

			redisManager.verify((rm) => rm.get(It.IsAny<string>()), Times.Once());

			expect(clubFromCache).to.be.null;
		});

		it('should throw if redis manager throws', async () => {
			const mockedError = new Error();
			const uuid = '2bedb101-012d-490a-bf6f-a801d95afc05';

			redisManager.setup((rm) => rm.get(It.IsAny<string>())).throwsAsync(mockedError);

			const getCachePromise = clubCacheRepository.getCache(uuid);

			await expect(getCachePromise).to.be.rejectedWith(mockedError);

			redisManager.verify((rm) => rm.get(It.IsAny<string>()), Times.Once());
			logger.verify((l) => l.error(It.IsAny<string>()), Times.Once());
		});
	});

	describe('saveCache', () => {
		it('should save in cache', async () => {
			redisManager
				.setup((rm) => rm.set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<number>()))
				.returnsAsync(null);

			await clubCacheRepository.saveCache(
				new Club(
					{
						uuid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						name: 'Club Atlético Vélez Sarsfield',
						foundationDate: new Date('1910-01-01'),
						createdAt: new Date('2023-01-01'),
						updatedAt: new Date('2023-01-01'),
						id: 1,
					},
					new Country({
						id: 1,
						uuid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						name: 'Argentina',
						code: 'AR',
					}),
				),
			);

			redisManager.verify(
				(rm) => rm.set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<number>()),
				Times.Once(),
			);
			logger.verify((l) => l.error(It.IsAny<string>()), Times.Never());
		});

		it('should throw if redis manager throws', async () => {
			const mockedError = new Error();

			redisManager
				.setup((rm) => rm.set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<number>()))
				.throwsAsync(mockedError);

			const saveCachePromise = clubCacheRepository.saveCache(
				new Club(
					{
						uuid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						name: 'Club Atlético Vélez Sarsfield',
						foundationDate: new Date('1910-01-01'),
						createdAt: new Date('2023-01-01'),
						updatedAt: new Date('2023-01-01'),
						id: 1,
					},
					new Country({
						id: 1,
						uuid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
						name: 'Argentina',
						code: 'AR',
					}),
				),
			);

			await expect(saveCachePromise).to.be.rejectedWith(mockedError);

			redisManager.verify(
				(rm) => rm.set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<number>()),
				Times.Once(),
			);
			logger.verify((l) => l.error(It.IsAny<string>()), Times.Once());
		});
	});

	describe('deleteCache', () => {
		it('should delete from cache', async () => {
			const uuid = '2bedb101-012d-490a-bf6f-a801d95afc05';

			redisManager.setup((rm) => rm.del(It.IsAny<string>())).returnsAsync(1);

			await clubCacheRepository.deleteCache(uuid);

			redisManager.verify((rm) => rm.del(It.IsAny<string>()), Times.Once());
			logger.verify((l) => l.error(It.IsAny<string>()), Times.Never());
		});

		it('should throw if redis manager throws', async () => {
			const mockedError = new Error();
			const uuid = '2bedb101-012d-490a-bf6f-a801d95afc05';

			redisManager.setup((rm) => rm.del(It.IsAny<string>())).throwsAsync(mockedError);

			const deleteCachePromise = clubCacheRepository.deleteCache(uuid);

			await expect(deleteCachePromise).to.be.rejectedWith(mockedError);

			redisManager.verify((rm) => rm.del(It.IsAny<string>()), Times.Once());
			logger.verify((l) => l.error(It.IsAny<string>()), Times.Once());
		});
	});
});
