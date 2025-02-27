import { Mock, Times } from 'moq.ts';
import { ISuperHeroRepository } from 'src/application/interfaces/ISuperHeroRepository';
import { SuperHeroService } from 'src/application/services/SuperHeroService';
import { SuperHero } from 'src/domain/entities/SuperHero';
import { expect } from 'chai';

describe('SuperHeroService.spec Test', () => {
	let repository: Mock<ISuperHeroRepository>;

	beforeEach(() => {
		repository = new Mock<ISuperHeroRepository>();
	});

	it('Create a super hero', async () => {
		//Arrange
		const superhero = createSuperHero(1);
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.create(superhero)).returnsAsync(undefined);

		//Act
		await service.create(superhero);

		//Assert
		repository.verify((m) => m.create(superhero), Times.Once());
	});

	it('Update a super hero', async () => {
		//Arrange
		const superhero = createSuperHero(1);
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.update(superhero)).returnsAsync(undefined);

		//Act
		await service.update(superhero);

		//Assert
		repository.verify((m) => m.update(superhero), Times.Once());
	});

	it('Delete a super hero', async () => {
		//Arrange
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.delete(1)).returnsAsync(undefined);

		//Act
		await service.delete(1);

		//Assert
		repository.verify((m) => m.delete(1), Times.Once());
	});

	it('Get a super hero', async () => {
		//Arrange
		const superhero = createSuperHero(1);
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.get(1)).returnsAsync(superhero);

		//Act
		const result = await service.findById(1);

		//Assert
		expect(result).equal(superhero);

		repository.verify((m) => m.get(1), Times.Once());
	});

	it('Get a super hero Not found', async () => {
		//Arrange
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.get(1)).returnsAsync(null);

		//Act
		const action = service.findById(1);

		//Assert
		await expect(action).eventually.rejectedWith('Super Hero was not found.');

		repository.verify((m) => m.get(1), Times.Once());
	});

	it('Get all super heros', async () => {
		//Arrange
		const superhero1 = createSuperHero(1);
		const superhero2 = createSuperHero(2);
		const service = new SuperHeroService(repository.object());

		repository.setup((m) => m.getAll()).returnsAsync([superhero1, superhero2]);

		//Act
		const result = await service.findAll();

		//Assert
		expect(result).deep.equals([superhero1, superhero2]);

		repository.verify((m) => m.getAll(), Times.Once());
	});
});

function createSuperHero(id: number): SuperHero {
	return {
		id: id,
		name: 'test',
		combat: '10',
		durability: '10',
		intelligence: '10',
		power: '10',
		speed: '10',
		strength: '10',
	};
}
