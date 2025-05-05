import { It, Mock, Times } from 'moq.ts';
import { IWorldCupRepository, WorldCupCreation } from 'src/application/interfaces/IWorldCupRepository';
import { CountryService } from 'src/application/services/CountryService';
import { WorldCupService } from 'src/application/services/WorldCupService';
import { Country } from 'src/domain/entities/Country';
import { WorldCup } from 'src/domain/entities/WorldCup';
import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { domainMocks } from 'test/unit/domain/mocks/DomainMocks';

describe('WorldCup service test.', () => {
	let worldCupService: WorldCupService;
	let wolrdCupRepository: Mock<IWorldCupRepository>;
	let countryService: Mock<CountryService>;

	beforeEach(() => {
		wolrdCupRepository = new Mock<IWorldCupRepository>();
		countryService = new Mock<CountryService>();

		worldCupService = new WorldCupService(wolrdCupRepository.object(), countryService.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(worldCupService).exist;
	});

	it('should create a world cup.', async () => {
		//Arrange
		const country = domainMocks.getCountry();
		const worldCup = domainMocks.getWorldCup();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		wolrdCupRepository.setup((m) => m.create(It.IsAny())).returnsAsync(worldCup);

		//Act
		const res = await worldCupService.create(country.uuid, worldCup);

		//Assert
		expect(res).to.be.deep.equal(worldCup);
	});

	it('should update a world cup.', async () => {
		//Arrange
		const country = new Mock<Country>().object();
		const worldCupCreation = new Mock<WorldCupCreation>().object();
		const worldCup = new Mock<WorldCup>().object();

		countryService.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		wolrdCupRepository.setup((m) => m.update(It.IsAny(), It.IsAny())).returnsAsync(worldCup);

		//Act
		const res = await worldCupService.update(faker.string.uuid(), country.uuid, worldCupCreation);

		//Assert
		expect(res).to.be.deep.equal(worldCup);
	});

	it('should delete a world cup.', async () => {
		//Arrange
		const worldCup = domainMocks.getWorldCup();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		wolrdCupRepository.setup((m) => m.deleteByUuid(It.IsAny())).returnsAsync();

		//Act
		await worldCupService.delete(worldCup.uuid);

		//Assert
		wolrdCupRepository.verify((m) => m.deleteByUuid(It.Is<string>((v) => v === worldCup.uuid))), Times.Once();
	});

	it('should find a world cup by uuid return an entity.', async () => {
		//Arrange
		const worldCup = domainMocks.getWorldCup();
		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);

		//Act
		const response: WorldCup = await worldCupService.findByUuid(worldCup.uuid);

		//Assert
		expect(response).to.be.deep.equal(worldCup);
	});

	it('should not find a world cup by uuid and throw error.', async () => {
		//Arrange
		const worldCupRes = new Mock<WorldCup>().object();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = worldCupService.findByUuid(worldCupRes.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('WorldCup was not found.');
		wolrdCupRepository.verify((m) => m.findByUuid(worldCupRes.uuid), Times.Once());
	});

	it('should return all world cups.', async () => {
		//Arrange
		const worldCup = domainMocks.getWorldCup();
		wolrdCupRepository.setup((m) => m.findAll()).returnsAsync([worldCup]);

		//Act
		const response = await worldCupService.findAll();

		//Assert
		expect(response).to.be.deep.equal([worldCup]);
	});

	it('should add participants to a world cup.', async () => {
		//Arrange
		const country = domainMocks.getCountry();
		const worldCup = domainMocks.getWorldCup();

		wolrdCupRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(worldCup);
		countryService.setup((m) => m.findAllByUuid(It.IsAny<string[]>())).returnsAsync([country]);
		wolrdCupRepository.setup((m) => m.addParticipants(It.IsAny(), It.IsAny())).returnsAsync();

		//Act
		await worldCupService.addParticipants(worldCup.uuid, [country.uuid]);

		//Assert
		wolrdCupRepository.verify((m) => m.addParticipants(It.IsAny<WorldCup>(), It.IsAny()), Times.Once());
	});

	it('should find a world cup by uuid with participants return an entity.', async () => {
		//Arrange
		const worldCupRes = domainMocks.getWorldCup();
		wolrdCupRepository.setup((m) => m.findOneWithParticipants(It.IsAny<string>())).returnsAsync(worldCupRes);

		//Act
		const response = await worldCupService.getWithParticipants(worldCupRes.uuid);

		//Assert
		wolrdCupRepository.verify((m) => m.findOneWithParticipants(worldCupRes.uuid), Times.Once());
		expect(response).instanceOf(WorldCup);
	});

	it('should find a world cup by uuid with participants throw error.', async () => {
		//Arrange
		const worldCupRes = new Mock<WorldCup>().object();

		wolrdCupRepository.setup((m) => m.findOneWithParticipants(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = worldCupService.getWithParticipants(worldCupRes.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('WorldCup was not found.');

		wolrdCupRepository.verify((m) => m.findOneWithParticipants(worldCupRes.uuid), Times.Once());
	});
});
