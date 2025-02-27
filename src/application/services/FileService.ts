import { Inject, Injectable } from '@nestjs/common';
import { FILE_REPO, IFileRepository } from '../interfaces/IFileRepository';
import { FileData } from 'src/domain/entities/FileData';
import { DuplicatedEntity } from 'src/domain/errors/DuplicatedEntity';

@Injectable()
export class FileService {
	constructor(@Inject(FILE_REPO) private fileRepository: IFileRepository) {}

	public async create(name: string, file: Buffer): Promise<void> {
		const fileNameExists = await this.fileRepository.exist(name);

		if (fileNameExists) {
			throw new DuplicatedEntity(name);
		}

		await this.fileRepository.upload(name, file);
	}

	public async getUrl(name: string): Promise<string> {
		return this.fileRepository.getSignedUrl(name, 1800);
	}

	public async delete(name: string): Promise<void> {
		await this.fileRepository.delete(name);
	}

	public async getAll(): Promise<FileData[]> {
		return this.fileRepository.getAll();
	}
}
