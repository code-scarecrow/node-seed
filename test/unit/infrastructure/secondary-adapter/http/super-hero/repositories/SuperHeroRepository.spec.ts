import { It, Mock, Times } from 'moq.ts';
import { AxiosError } from 'axios';
import { SuperHero } from 'src/domain/entities/SuperHero';
import { expect } from 'chai';
import { SuperHeroClient } from 'src/infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';
import { IGetSuperHeroResponse } from 'src/infrastructure/secondary-adapters/http/super-hero/repositories/responses/GetSuperHeroResponse';
import { SuperHeroRepository } from 'src/infrastructure/secondary-adapters/http/super-hero/repositories/SuperHeroRepository';

describe('Super Hero Repository Test', () => {
	let superHeroRepository: SuperHeroRepository;
	let httpClient: Mock<SuperHeroClient>;

	beforeEach(() => {
		httpClient = new Mock<SuperHeroClient>();
		superHeroRepository = new SuperHeroRepository(httpClient.object());
	});

	it('Get one super hero', async () => {
		//Arrange
		const id = 1;
		const superHero = createGetSuperHeroResponse(id);

		httpClient.setup((m) => m.get(It.IsAny())).returnsAsync(superHero);

		//Act
		const result = await superHeroRepository.get(id);

		//Assert
		httpClient.verify((m) => m.get(It.IsAny()), Times.Once());

		expect(result).deep.equal(superHero);
	});

	it('Not found super hero', async () => {
		//Arrange
		const error = new AxiosError('Request failed with status code 404', '404');

		httpClient.setup((m) => m.get(It.IsAny())).throwsAsync(error);

		//Act
		const getSuperHeroPromise = superHeroRepository.get(99);

		//Assert
		await expect(getSuperHeroPromise).to.be.rejectedWith(error);
	});

	it('Server Internal Err in http client', async () => {
		//Arrange
		const error = new AxiosError('Request failed with status code 500', '500');

		httpClient.setup((m) => m.get(It.IsAny())).throwsAsync(error);

		//Act
		const getSuperHeroPromise = superHeroRepository.get(99);

		//Assert
		await expect(getSuperHeroPromise).to.be.rejectedWith(error);
	});

	it('Create a super hero', async () => {
		//Arrange
		const sh = createSuperHero(1);
		httpClient.setup((m) => m.post(It.IsAny(), It.IsAny())).returnsAsync(undefined);

		//Act
		await superHeroRepository.create(sh);

		//Assert
		httpClient.verify(
			(m) =>
				m.post(
					'/super-heroes',
					It.Is((v) => JSON.stringify(v) === JSON.stringify(sh)),
				),
			Times.Once(),
		);
	});

	it('Edit a super hero', async () => {
		//Arrange
		const sh = createSuperHero(1);
		httpClient.setup((m) => m.put(It.IsAny(), It.IsAny())).returnsAsync(undefined);

		//Act
		await superHeroRepository.update(sh);

		//Assert
		httpClient.verify(
			(m) =>
				m.put(
					'/super-heroes/1',
					It.Is((v) => JSON.stringify(v) === JSON.stringify(sh)),
				),
			Times.Once(),
		);
	});

	it('Delete a super hero', async () => {
		//Arrange
		httpClient.setup((m) => m.delete(It.IsAny())).returnsAsync(undefined);

		//Act
		await superHeroRepository.delete(1);

		//Assert
		httpClient.verify((m) => m.delete(It.IsAny()), Times.Once());
	});

	it('Get all super heros', async () => {
		//Arrange
		const sh1 = createGetSuperHeroResponse(1);
		const sh2 = createGetSuperHeroResponse(2);
		const expected = [sh1, sh2];

		httpClient.setup((m) => m.get(It.IsAny())).returnsAsync([sh1, sh2]);

		//Act
		const result = await superHeroRepository.getAll();

		//Assert
		expect(result).deep.equal(expected);
		httpClient.verify((m) => m.get(It.IsAny()), Times.Once());
	});
});

function createGetSuperHeroResponse(id: number): IGetSuperHeroResponse {
	return {
		id: id,
		name: 'test',
		durability: '10',
		intelligence: '10',
		power: '10',
		speed: '10',
		strength: '10',
		combat: '10',
	};
}

function createSuperHero(id: number): SuperHero {
	return {
		id: id,
		name: 'test',
		durability: '10',
		intelligence: '10',
		power: '10',
		speed: '10',
		strength: '10',
		combat: '10',
	};
}
