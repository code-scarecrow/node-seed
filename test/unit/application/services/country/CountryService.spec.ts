import { It, Mock, Times } from 'moq.ts';
import { ICountryRepository } from 'src/application/interfaces/ICountryRepository';
import { CountryService } from 'src/application/services/CountryService';
import { Country } from 'src/domain/entities/Country';
import { expect } from 'chai';

describe('Country service test.', () => {
	let countryService: CountryService;
	let countryRepository: Mock<ICountryRepository>;

	beforeEach(() => {
		countryRepository = new Mock<ICountryRepository>();
		countryService = new CountryService(countryRepository.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(countryService).exist;
	});

	it('should create a country.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.create(It.IsAny<Country>())).returnsAsync(country);

		//Act
		await countryService.create(country);

		//Assert
		countryRepository.verify((m) => m.create(country), Times.Once());
	});

	it('should update a country.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		countryRepository.setup((m) => m.update(It.IsAny<{ id: number }>(), It.IsAny<Country>())).returnsAsync(country);

		//Act
		await countryService.update(country.uuid, country);

		//Assert
		countryRepository.verify(
			(m) =>
				m.update(
					It.Is<{ id: number }>((v) => v.id === country.id),
					country,
				),
			Times.Once(),
		);
	});

	it('should delete a country.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);
		countryRepository.setup((m) => m.delete(It.IsAny<{ id: number }>())).returnsAsync(undefined);

		//Act
		await countryService.delete(country.uuid);

		//Assert
		countryRepository.verify((m) => m.delete(It.Is<{ id: number }>((v) => v.id === country.id)), Times.Once());
	});

	it('should find a country by uuid return an entity.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(country);

		//Act
		const response = await countryService.findByUuid(country.uuid);

		//Assert
		countryRepository.verify((m) => m.findByUuid(country.uuid), Times.Once());

		expect(response).instanceOf(Country);
	});

	it('should find a country by uuid throw error.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.findByUuid(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = countryService.findByUuid(country.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('Country was not found.');

		countryRepository.verify((m) => m.findByUuid(country.uuid), Times.Once());
	});

	it('should return all countries.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.findAll()).returnsAsync([country]);

		//Act
		const response = await countryService.findAll();

		//Assert
		countryRepository.verify((m) => m.findAll(), Times.Once());

		response.map((c) => expect(c).instanceOf(Country));
	});

	it('should find all countries in array of uuids.', async () => {
		//Arrange
		const country = new Country();
		countryRepository.setup((m) => m.findAllByUuid(It.IsAny<string[]>())).returnsAsync([country]);

		//Act
		const response = await countryService.findAllByUuid(['877ad1e3-9114-11ed-b879-0242ac180006']);

		//Assert
		countryRepository.verify((m) => m.findAllByUuid(It.IsAny<string[]>()), Times.Once());

		response.map((c) => expect(c).instanceOf(Country));
	});

	it('should find a country by uuid with players return a entity.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.getCountryWithPlayers(It.IsAny<string>())).returnsAsync(country);

		//Act
		const response = await countryService.getCountryPlayers(country.uuid);

		//Assert
		countryRepository.verify((m) => m.getCountryWithPlayers(country.uuid), Times.Once());

		expect(response).instanceOf(Country);
	});

	it('should find a country by with players uuid throw error.', async () => {
		//Arrange
		const country = new Country();

		countryRepository.setup((m) => m.getCountryWithPlayers(It.IsAny<string>())).returnsAsync(null);

		//Act
		const action = countryService.getCountryPlayers(country.uuid);

		//Assert
		await expect(action).to.eventually.rejectedWith('Country was not found.');

		countryRepository.verify((m) => m.getCountryWithPlayers(country.uuid), Times.Once());
	});
});
