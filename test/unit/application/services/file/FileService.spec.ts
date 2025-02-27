import { It, Mock } from 'moq.ts';
import { expect } from 'chai';
import { FileService } from 'src/application/services/FileService';
import { IFileRepository } from 'src/application/interfaces/IFileRepository';
import { DuplicatedEntity } from 'src/domain/errors/DuplicatedEntity';
import { FileData } from 'src/domain/entities/FileData';

describe('File service test.', () => {
	let fileService: FileService;
	let fileRepository: Mock<IFileRepository>;
	let bufferMock: Mock<Buffer>;

	beforeEach(() => {
		fileRepository = new Mock<IFileRepository>();
		bufferMock = new Mock<Buffer>();
		fileService = new FileService(fileRepository.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(fileService).exist;
	});

	it('should create a file.', async () => {
		//Arrange
		fileRepository.setup((r) => r.exist(It.IsAny())).returnsAsync(false);
		fileRepository.setup((r) => r.upload(It.IsAny(), It.IsAny())).returnsAsync(undefined);

		//Act
		await fileService.create('test', bufferMock.object());
	});

	it('should fail creating a file.', async () => {
		//Arrange
		fileRepository.setup((r) => r.exist(It.IsAny())).returnsAsync(true);

		//Act
		const action = fileService.create('test-fail', bufferMock.object());

		//Assert
		await expect(action).eventually.rejectedWith(DuplicatedEntity);
	});

	it('should get url for file.', async () => {
		//Arrange
		fileRepository.setup((r) => r.getSignedUrl(It.IsAny(), It.IsAny())).returnsAsync('test');

		//Act
		const res = await fileService.getUrl('test');

		//Assert
		expect(res).to.be.equal('test');
	});

	it('should delete file.', async () => {
		//Arrange
		fileRepository.setup((r) => r.delete(It.IsAny())).returnsAsync(undefined);

		//Act
		await fileService.delete('test');
	});

	it('should get all files.', async () => {
		//Arrange
		const data: FileData[] = [];
		fileRepository.setup((r) => r.getAll(It.IsAny())).returnsAsync(data);

		//Act
		const res = await fileService.getAll();

		//Assert
		expect(res).to.be.equal(res);
	});
});
