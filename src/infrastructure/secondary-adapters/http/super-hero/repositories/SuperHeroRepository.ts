import { HttpStatus, Injectable } from '@nestjs/common';
import { IGetSuperHeroResponse } from './responses/GetSuperHeroResponse';
import { SuperHeroClient } from '../client/SuperHeroClient';
import { ISuperHeroRepository } from 'src/application/interfaces/ISuperHeroRepository';
import { SuperHero } from 'src/domain/entities/SuperHero';
import axios from 'axios';
import { ISuperHeroRequest } from './requests/SuperHeroRequest';

@Injectable()
export class SuperHeroRepository implements ISuperHeroRepository {
	constructor(private readonly httpClient: SuperHeroClient) {}

	public async getAll(): Promise<SuperHero[]> {
		return await this.httpClient.get<IGetSuperHeroResponse[]>('/super-heroes');
	}

	public async get(id: number): Promise<SuperHero | null> {
		try {
			return await this.httpClient.get<IGetSuperHeroResponse | null>('/super-heroes/' + id);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response && error.response.status === HttpStatus.NOT_FOUND) {
				return null;
			}
			throw error;
		}
	}

	public async delete(id: number): Promise<void> {
		await this.httpClient.delete('/super-heroes/' + id);
	}

	public async create(sh: SuperHero): Promise<void> {
		await this.httpClient.post<ISuperHeroRequest>('/super-heroes', sh);
	}

	public async update(sh: SuperHero): Promise<void> {
		await this.httpClient.put<ISuperHeroRequest>('/super-heroes/' + sh.id, sh);
	}
}
