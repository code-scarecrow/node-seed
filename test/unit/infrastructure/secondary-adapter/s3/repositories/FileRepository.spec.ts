import { It, Mock } from 'moq.ts';
import { expect } from 'chai';
import { FilesRepository } from 'src/infrastructure/secondary-adapters/s3/repositories/FilesRepository';
import { S3, S3ModuleOptions } from 'nestjs-s3';
import {
	HeadObjectCommandOutput,
	ListObjectsV2CommandOutput,
	PutObjectCommand,
	ServiceOutputTypes,
} from '@aws-sdk/client-s3';

describe('FileRepository tests.', () => {
	let config: Mock<S3ModuleOptions & { filesBucketName: string }>;
	let s3: Mock<S3>;
	let fileRepository: FilesRepository;

	beforeEach(() => {
		config = new Mock<S3ModuleOptions & { filesBucketName: string }>();
		config.setup((m) => m.filesBucketName).returns('test');
		s3 = new Mock<S3>();
		fileRepository = new FilesRepository(s3.object(), config.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(fileRepository).exist;
	});

	it('should send upload command.', async () => {
		//Arrange
		s3.setup((s) => s.send(It.IsAny())).returnsAsync(new Mock<ServiceOutputTypes>().object());

		//Act
		await fileRepository.upload('test', new Mock<Buffer>().object());

		//Assert
		s3.verify((s) => s.send(It.Is((i) => i instanceof PutObjectCommand)));
	});

	it('should return empty list.', async () => {
		//Arrange
		const s3Res: Mock<ListObjectsV2CommandOutput> = new Mock();
		s3Res.setup((r) => r.Contents).returns(undefined);
		s3.setup((s) => s.listObjectsV2(It.IsAny())).returnsAsync(s3Res.object());

		//Act
		const res = await fileRepository.getAll('test');

		//Assert
		expect(res).to.be.empty;
	});

	it('should return a list.', async () => {
		//Arrange
		const s3Res: Mock<ListObjectsV2CommandOutput> = new Mock();
		s3Res
			.setup((r) => r.Contents)
			.returns([
				{ Key: 'test1', Size: 4, LastModified: new Date(Date.now()) },
				{ Key: 'test2', Size: 8, LastModified: new Date(Date.now()) },
			]);
		s3.setup((s) => s.listObjectsV2(It.IsAny())).returnsAsync(s3Res.object());

		//Act
		const res = await fileRepository.getAll();

		//Assert
		expect(res).to.length(2);
	});

	it('should throw no key error.', async () => {
		//Arrange
		const s3Res: Mock<ListObjectsV2CommandOutput> = new Mock();
		s3Res.setup((r) => r.Contents).returns([{ Size: 4, LastModified: new Date(Date.now()) }]);

		s3.setup((s) => s.listObjectsV2(It.IsAny())).returnsAsync(s3Res.object());

		//Act
		const action = fileRepository.getAll();

		//Assert
		await expect(action).to.eventually.rejectedWith('Error listing S3 items, object without key');
	});

	it('should throw no size error.', async () => {
		//Arrange
		const s3Res: Mock<ListObjectsV2CommandOutput> = new Mock();

		s3Res.setup((r) => r.Contents).returns([{ Key: 'test1', LastModified: new Date(Date.now()) }]);
		s3.setup((s) => s.listObjectsV2(It.IsAny())).returnsAsync(s3Res.object());

		//Act
		const action = fileRepository.getAll();

		//Assert
		await expect(action).to.eventually.rejectedWith('Error listing S3 items, object without size');
	});

	it('should throw no lastModified error.', async () => {
		//Arrange
		const s3Res: Mock<ListObjectsV2CommandOutput> = new Mock();

		s3Res.setup((r) => r.Contents).returns([{ Key: 'test1', Size: 4 }]);
		s3.setup((s) => s.listObjectsV2(It.IsAny())).returnsAsync(s3Res.object());

		//Act
		const action = fileRepository.getAll();

		//Assert
		await expect(action).to.eventually.rejectedWith('Error listing S3 items, object without lastModified');
	});

	it('should send delete command.', async () => {
		//Arrange
		s3.setup((s) => s.deleteObject(It.IsAny())).returnsAsync(new Mock<ServiceOutputTypes>().object());

		//Act
		await fileRepository.delete('test');

		//Assert
		s3.verify((s) => s.deleteObject(It.Is((i: { Key: string }) => i.Key === 'test')));
	});

	it('should return false when file doesn`t exists.', async () => {
		//Arrange
		s3.setup((s) => s.headObject(It.IsAny())).throwsAsync({ name: 'NotFound' });

		//Act
		const res = await fileRepository.exist('test');

		//Assert
		expect(res).to.be.false;
	});

	it('should return true when file exists.', async () => {
		//Arrange
		s3.setup((s) => s.headObject(It.IsAny())).returnsAsync(new Mock<HeadObjectCommandOutput>().object());

		//Act
		const res = await fileRepository.exist('test');

		//Assert
		expect(res).to.be.true;
	});

	it('should rethrow exceptions.', async () => {
		//Arrange
		s3.setup((s) => s.headObject(It.IsAny())).throwsAsync(new Error('test error'));

		//Act
		const res = fileRepository.exist('test');

		//Assert
		await expect(res).to.eventually.be.rejectedWith('test error');
	});
});
