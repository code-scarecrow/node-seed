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
import { WorldCupResponse } from './response/WorldCupResponse';
import { WorldCupRequest } from './request/WorldCupRequest';
import { WorldCupService } from 'src/application/services/WorldCupService';
import { AddParticipantsRequest } from './request/AddParticipantsRequest';
import { AddParticipantsResponse } from './response/AddParticipantsResponse';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('world-cups')
@ApiTags('World Cups')
@ApiHeader({ name: 'Country-Code' })
@ApiExtraModels(WorldCupResponse, AddParticipantsResponse)
export class WorldCupController {
	constructor(private worldCupService: WorldCupService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a World Cup' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(WorldCupResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() worldCupRequest: WorldCupRequest): Promise<WorldCupResponse> {
		const worldCup = await this.worldCupService.create(worldCupRequest.countryId, worldCupRequest.toEntity());

		return new WorldCupResponse(worldCup);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a World cup' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(WorldCupResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() worldCupRequest: WorldCupRequest,
	): Promise<WorldCupResponse> {
		const updatedWorldCup = await this.worldCupService.update(
			id,
			worldCupRequest.countryId,
			worldCupRequest.toEntity(),
		);

		return new WorldCupResponse(updatedWorldCup);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a World cup' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.worldCupService.delete(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all World cups!' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					type: 'array',
					items: { $ref: getSchemaPath(WorldCupResponse) },
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<WorldCupResponse[]> {
		const worldCups = await this.worldCupService.findAll();

		return worldCups.map((worldCup) => new WorldCupResponse(worldCup));
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a World cup!' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(WorldCupResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<WorldCupResponse> {
		const worldCup = await this.worldCupService.findByUuid(id);

		return new WorldCupResponse(worldCup);
	}

	@Post(':id/participants')
	@HttpCode(HttpStatus.ACCEPTED)
	@ApiOperation({ summary: 'Add Participants' })
	@ApiResponse({
		status: HttpStatus.ACCEPTED,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(AddParticipantsResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async addParticipants(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() request: AddParticipantsRequest,
	): Promise<AddParticipantsResponse> {
		await this.worldCupService.addParticipants(id, request.participants);

		return new AddParticipantsResponse();
	}

	@Get(':id/participants')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all WorldCup`s Participants' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(WorldCupResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getWithParticipants(@Param('id', ParseUUIDPipe) id: string): Promise<WorldCupResponse> {
		const worldCupWithParticipants = await this.worldCupService.getWithParticipants(id);

		return new WorldCupResponse(worldCupWithParticipants);
	}
}
