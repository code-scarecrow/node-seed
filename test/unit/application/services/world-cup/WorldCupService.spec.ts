import { It, Mock, Times } from 'moq.ts';
import { IWorldCupRepository } from 'src/application/interfaces/IWorldCupRepository';
import { CountryService } from 'src/application/services/CountryService';
import { WorldCupService } from 'src/application/services/WorldCupService';
import { CountryEntity } from 'src/domain/entities/CountryEntity';
import { WorldCupEntity } from 'src/domain/entities/WorldCupEntity';
import { UnitOfWorkFactory, IUOWRepositoryManager } from '@code-scarecrow/base/database';
import { expect } from 'chai';
import { createUOWRepositoryManagerMock } from 'test/unit/mocks/UOWRepositoryManagerMock';

describe('WorldCup service test.', () => {
	let worldCupService: WorldCupService;
	let wolrdCupRepository: Mock<IWorldCupRepository>;
	let countryService: Mock<CountryService>;
	let unitOfWork: Mock<UnitOfWorkFactory>;
	let uow: Mock<IUOWRepositoryManager>;

	beforeEach(() => {
		wolrdCupRepository = new Mock<IWorldCupRepository>();
		countryService = new Mock<CountryService>();
		unitOfWork = new Mock<UnitOfWorkFactory>();
		uow = createUOWRepositoryManagerMock();

		unitOfWork.setup((m) => m.getUnitOfWork()).returns(uow.object());
		uow
			.setup((m) => m.getRepository(It.IsAny()))
			.callback((id) => {
				if (id.args[0].name === WorldCupEntity.name) return wolrdCupRepository.object();
				throw new Error('Not mocked repository');
			});

		worldCupService = new WorldCupService(wolrdCupRepository.object(), countryService.object(), unitOfWork.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(worldCupService).exist;
	});

	it('should create a world cup.', async () => {
		//Arrange
		const country = new CountryEntity();
		const worldCup = new WorldCupEntity();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		wolrdCupRepository.setup((m) => m.create(worldCup)).returnsAsync(worldCup);

		//Act
		await worldCupService.create(country.uuid, worldCup);

		//Assert
		wolrdCupRepository.verify((m) => m.create(worldCup), Times.Once());
	});

	it('should update a world cup.', async () => {
		//Arrange
		const country = new CountryEntity();
		const worldCup = new WorldCupEntity();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		wolrdCupRepository
			.setup((m) =>
				m.update(
					It.Is<{ id: number }>((v) => v.id === worldCup.id),
					worldCup,
				),
			)
			.returnsAsync(worldCup);

		//Act
		await worldCupService.update(worldCup.uuid, country.uuid, worldCup);

		//Assert
		wolrdCupRepository.verify(
			(m) =>
				m.update(
					It.Is<{ id: number }>((v) => v.id === worldCup.id),
					worldCup,
				),
			Times.Once(),
		);
	});

	it('should delete a world cup.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		wolrdCupRepository.setup((m) => m.save(It.IsAny<WorldCupEntity>())).returnsAsync(worldCup);
		wolrdCupRepository
			.setup((m) => m.delete(It.Is<{ id: number }>((v) => v.id === worldCup.id)))
			.returnsAsync(undefined);

		//Act
		await worldCupService.delete(worldCup.uuid);

		//Assert
		wolrdCupRepository.verify((m) => m.delete(It.Is<{ id: number }>((v) => v.id === worldCup.id))), Times.Once();
	});

	it('should find a world cup by uuid return an entity.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);

		//Act
		const response: WorldCupEntity = await worldCupService.findByUuid(worldCup.uuid);

		//Assert
		wolrdCupRepository.verify((m) => m.findByUuid(worldCup.uuid), Times.Once());

		expect(response).instanceOf(WorldCupEntity);
	});

	it('should not find a world cup by uuid and throw error.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = worldCupService.findByUuid(worldCup.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('WorldCup was not found.');
		wolrdCupRepository.verify((m) => m.findByUuid(worldCup.uuid), Times.Once());
	});

	it('should return all world cups.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findAll()).returnsAsync([worldCup]);

		//Act
		const response = await worldCupService.findAll();

		//Assert
		wolrdCupRepository.verify((m) => m.findAll(), Times.Once());

		response.map((wc) => expect(wc).instanceOf(WorldCupEntity));
	});

	it('should add participants to a world cup.', async () => {
		//Arrange
		const country = new CountryEntity();
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		countryService.setup((m) => m.findAllByUuid(It.IsAny<string[]>())).returnsAsync([country]);
		wolrdCupRepository.setup((m) => m.save(It.IsAny<WorldCupEntity>())).returnsAsync(worldCup);

		//Act
		await worldCupService.addParticipants(worldCup.uuid, [country.uuid]);

		//Assert
		wolrdCupRepository.verify((m) => m.save(It.IsAny<WorldCupEntity>()), Times.Once());
	});

	it('should find a world cup by uuid with participants return an entity.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findOneWithParticipants(It.IsAny<string>())).returnsAsync(worldCup);

		//Act
		const response = await worldCupService.getWithParticipants(worldCup.uuid);

		//Assert
		wolrdCupRepository.verify((m) => m.findOneWithParticipants(worldCup.uuid), Times.Once());
		expect(response).instanceOf(WorldCupEntity);
	});

	it('should find a world cup by uuid with participants throw error.', async () => {
		//Arrange
		const worldCup = new WorldCupEntity();

		wolrdCupRepository.setup((m) => m.findOneWithParticipants(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = worldCupService.getWithParticipants(worldCup.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('WorldCup was not found.');

		wolrdCupRepository.verify((m) => m.findOneWithParticipants(worldCup.uuid), Times.Once());
	});
});
