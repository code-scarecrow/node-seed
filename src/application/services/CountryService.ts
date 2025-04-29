import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFound } from 'src/domain/errors/EntityNotFound';
import { COUNTRY_REPO, CountryCreation, ICountryRepository } from '../interfaces/ICountryRepository';
import { Country } from 'src/domain/entities/Country';

@Injectable()
export class CountryService {
	constructor(@Inject(COUNTRY_REPO) private readonly countryRepository: ICountryRepository) {}

	public async create(country: CountryCreation): Promise<Country> {
		return await this.countryRepository.create(country);
	}

	public async update(id: string, country: CountryCreation): Promise<Country> {
		const countryDb = await this.findByUuid(id);

		return await this.countryRepository.update({ id: countryDb.id }, country);
	}

	public async delete(id: string): Promise<void> {
		const country = await this.findByUuid(id);

		await this.countryRepository.delete({ id: country.id });
	}

	public async findByUuid(uuid: string): Promise<Country> {
		const country = await this.countryRepository.findByUuid(uuid);

		if (!country) throw new EntityNotFound('Country');

		return country;
	}

	public async findAll(): Promise<Country[]> {
		return await this.countryRepository.findAll();
	}

	public async findAllByUuid(uuids: string[]): Promise<Country[]> {
		return await this.countryRepository.findAllByUuid(uuids);
	}

	public async getCountryPlayers(id: string): Promise<Country> {
		const country = await this.countryRepository.getCountryWithPlayers(id);

		if (!country) throw new EntityNotFound('Country');

		return country;
	}
}
