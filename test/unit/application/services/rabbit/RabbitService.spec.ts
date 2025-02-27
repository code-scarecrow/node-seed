import { It, Mock, Times } from 'moq.ts';
import { IRabbitRepository } from 'src/application/interfaces/IRabbitRepository';
import { RabbitService } from 'src/application/services/RabbitService';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { RabbitRacesEnum } from 'src/domain/enums/RabbitRaces';
import { expect } from 'chai';

describe('RabbitService Test', () => {
	let rabbitRepository: Mock<IRabbitRepository>;

	beforeEach(() => {
		rabbitRepository = new Mock<IRabbitRepository>();
	});

	it('Create a Rabbit', async () => {
		//Arrange
		const rabbit = createRabbit('test');
		const rabbitService = new RabbitService(rabbitRepository.object());

		rabbitRepository.setup((m) => m.create(It.IsAny<Rabbit>())).returnsAsync(rabbit);

		//Act
		const result = await rabbitService.create(rabbit);

		//Assert
		expect(result).equal(rabbit);

		rabbitRepository.verify((m) => m.create(rabbit), Times.Once());
	});

	it('Update a Rabbit', async () => {
		//Arrange
		const rabbit = createRabbit('test');
		const rabbitService = new RabbitService(rabbitRepository.object());

		rabbitRepository.setup((m) => m.update(It.IsAny<{ id: string }>(), It.IsAny<Rabbit>())).returnsAsync(rabbit);

		//Act
		const result = await rabbitService.update(rabbit);

		//Assert
		expect(result).equal(rabbit);

		rabbitRepository.verify(
			(m) =>
				m.update(
					It.Is<{ id: string }>((v) => v.id === 'test'),
					rabbit,
				),
			Times.Once(),
		);
	});

	it('Delete a Rabbit', async () => {
		//Arrange
		const rabbitService = new RabbitService(rabbitRepository.object());

		rabbitRepository.setup((m) => m.delete(It.IsAny<{ id: string }>())).returnsAsync(undefined);

		//Act
		await rabbitService.delete('test');

		//Assert
		rabbitRepository.verify((m) => m.delete(It.Is<{ id: string }>((v) => v.id === 'test')), Times.Once());
	});

	it('Get a Rabbit', async () => {
		//Arrange
		const rabbit = createRabbit('test');
		const rabbitService = new RabbitService(rabbitRepository.object());

		rabbitRepository.setup((m) => m.findByKey(It.IsAny<{ id: string }>())).returnsAsync(rabbit);

		//Act
		const result = await rabbitService.findById('test');

		//Assert
		expect(result).equal(rabbit);

		rabbitRepository.verify((m) => m.findByKey(It.Is<{ id: string }>((v) => v.id === 'test')), Times.Once());
	});

	it('Get a Rabbit Not found', async () => {
		//Arrange
		const rabbitService = new RabbitService(rabbitRepository.object());

		rabbitRepository.setup((m) => m.findByKey(It.IsAny<{ id: string }>())).returnsAsync(null);

		//Act
		const action = rabbitService.findById('test');

		//Assert
		await expect(action).eventually.rejectedWith('Rabbit was not found.');

		rabbitRepository.verify((m) => m.findByKey(It.Is<{ id: string }>((v) => v.id === 'test')), Times.Once());
	});
});

function createRabbit(id: string): Rabbit {
	return {
		id: id,
		name: 'test',
		age: 0,
		race: RabbitRacesEnum.AMERICAN,
	};
}
