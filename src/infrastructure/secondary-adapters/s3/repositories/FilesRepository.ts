import { Inject, Injectable } from '@nestjs/common/decorators';
import { PutObjectCommand, GetObjectCommand, ListObjectsV2CommandInput } from '@aws-sdk/client-s3';
import { InjectS3, S3 } from 'nestjs-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IFileRepository } from 'src/application/interfaces/IFileRepository';
import { FileData } from 'src/domain/entities/FileData';
import { ConfigType } from '@nestjs/config';
import { awsClientS3Config } from '../config/AWSClientS3Config';

@Injectable()
export class FilesRepository implements IFileRepository {
	private readonly bucketName: string;

	constructor(
		@InjectS3() private readonly s3: S3,
		@Inject(awsClientS3Config.KEY) config: ConfigType<typeof awsClientS3Config>,
	) {
		this.bucketName = config.filesBucketName;
	}

	public async upload(key: string, file: Buffer): Promise<void> {
		const params = {
			Key: key,
			Body: file,
			Bucket: this.bucketName,
		};
		const command = new PutObjectCommand(params);
		await this.s3.send(command);
	}

	public async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
		const params = {
			Bucket: this.bucketName,
			Key: key,
		};
		const command = new GetObjectCommand(params);
		return await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
	}

	public async getAll(prefix?: string): Promise<FileData[]> {
		const options: ListObjectsV2CommandInput = {
			Bucket: this.bucketName,
		};
		if (prefix) options.Prefix = prefix;

		const res = await this.s3.listObjectsV2(options);

		if (!res.Contents) return [];

		return res.Contents.map((o) => {
			if (o.Key === undefined) throw new Error('Error listing S3 items, object without key');
			if (o.Size === undefined) throw new Error('Error listing S3 items, object without size');
			if (o.LastModified === undefined) throw new Error('Error listing S3 items, object without lastModified');
			return new FileData(o.Key, o.Size, o.LastModified);
		});
	}

	public async delete(key: string): Promise<void> {
		const params = {
			Bucket: this.bucketName,
			Key: key,
		};
		await this.s3.deleteObject(params);
	}

	public async exist(filename: string): Promise<boolean> {
		try {
			const params = {
				Bucket: this.bucketName,
				Key: filename,
			};
			await this.s3.headObject(params);
			return true;
		} catch (error) {
			if (this.isS3Error(error) && error.name === 'NotFound') return false;
			throw error;
		}
	}

	private readonly isRecord = (obj: unknown): obj is Record<string, unknown> => typeof obj === 'object';

	private readonly isS3Error = (obj: unknown): obj is IS3Error => {
		return !!obj && this.isRecord(obj) && 'name' in obj && typeof obj['name'] === 'string';
	};
}

interface IS3Error {
	name: string;
}
