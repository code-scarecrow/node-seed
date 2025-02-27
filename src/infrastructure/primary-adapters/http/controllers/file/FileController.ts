import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipeBuilder,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiHeader,
	ApiResponse,
	ApiBody,
	ApiConsumes,
} from '@nestjs/swagger';
import { ErrorResponse } from '@code-scarecrow/base';
import { FileService } from 'src/application/services/FileService';
import { FileDataResponse } from './response/FileDataResponse';
import { UrlResponse } from './response/UrlResponse';

@Controller('files')
@ApiTags('Files')
@ApiHeader({ name: 'Country-Code' })
export class FileController {
	constructor(private fileService: FileService) {}

	@Post(':name')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Upload a file' })
	@ApiBody({
		required: true,
		type: 'multipart/form-data',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(
		@Param('name') name: string,
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: /(jpg|jpeg|png|gif)$/,
				})
				.build({
					errorHttpStatusCode: HttpStatus.BAD_REQUEST,
				}),
		)
		file: Express.Multer.File,
	): Promise<void> {
		return this.fileService.create(name, file.buffer);
	}

	@Delete(':name')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a file' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('name') name: string): Promise<void> {
		return this.fileService.delete(name);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all files' })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<FileDataResponse[]> {
		const files = await this.fileService.getAll();

		return files.map((file) => new FileDataResponse(file));
	}

	@Get(':name/signed-url')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a file URL' })
	@ApiResponse({
		status: HttpStatus.OK,
		type: UrlResponse,
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getUrl(@Param('name') name: string): Promise<UrlResponse> {
		const fileUrl = await this.fileService.getUrl(name);

		return new UrlResponse(fileUrl);
	}
}
