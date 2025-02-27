import { FileData } from 'src/domain/entities/FileData';

export const FILE_REPO = 'IFileRepository';

export interface IFileRepository {
	upload(key: string, file: Buffer): Promise<void>;
	getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
	getAll(prefix?: string | undefined): Promise<FileData[]>;
	delete(key: string): Promise<void>;
	exist(filename: string): Promise<boolean>;
}
