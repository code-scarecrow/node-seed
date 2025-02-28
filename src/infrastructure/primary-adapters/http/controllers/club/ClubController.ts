import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiBadRequestResponse,
	ApiHeader,
	ApiResponse,
	getSchemaPath,
	ApiExtraModels,
} from '@nestjs/swagger';
import { ClubService } from 'src/application/services/ClubService';
import { ClubResponse } from './response/ClubResponse';
import { ClubRequest } from './request/ClubRequest';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('clubs')
@ApiTags('Clubs')
@ApiHeader({ name: 'Country-Code' })
@ApiExtraModels(ClubResponse)
export class ClubController {
	constructor(private readonly clubService: ClubService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a Club' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(ClubResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() clubRequest: ClubRequest): Promise<ClubResponse> {
		const club = await this.clubService.create(clubRequest.countryId, clubRequest.toEntity());

		return new ClubResponse(club);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a Club' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(ClubResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(@Param('id', ParseUUIDPipe) id: string, @Body() clubRequest: ClubRequest): Promise<ClubResponse> {
		const updatedClub = await this.clubService.update(id, clubRequest.countryId, clubRequest.toEntity());

		return new ClubResponse(updatedClub);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a Club' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.clubService.delete(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all Clubs' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					type: 'array',
					items: { $ref: getSchemaPath(ClubResponse) },
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<ClubResponse[]> {
		const clubs = await this.clubService.findAll();

		return clubs.map((club) => new ClubResponse(club));
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a Club' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(ClubResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<ClubResponse> {
		const club = await this.clubService.findByUuid(id);

		return new ClubResponse(club);
	}
}
