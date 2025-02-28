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
import { PlayerService } from 'src/application/services/PlayerService';
import { PlayerResponse } from './response/PlayerResponse';
import { PlayerRequest } from './request/PlayerRequest';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('players')
@ApiTags('Players')
@ApiHeader({ name: 'Country-Code' })
@ApiExtraModels(PlayerResponse)
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a Player' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(PlayerResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() playerRequest: PlayerRequest): Promise<PlayerResponse> {
		const player = await this.playerService.create(
			playerRequest.countryId,
			playerRequest.clubId,
			playerRequest.toEntity(),
		);

		return new PlayerResponse(player);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a Player' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(PlayerResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() playerRequest: PlayerRequest,
	): Promise<PlayerResponse> {
		const updatedPlayer = await this.playerService.update(
			id,
			playerRequest.countryId,
			playerRequest.clubId,
			playerRequest.toEntity(),
		);

		return new PlayerResponse(updatedPlayer);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a Player' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.playerService.delete(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all Players!' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					type: 'array',
					items: { $ref: getSchemaPath(PlayerResponse) },
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<PlayerResponse[]> {
		const players = await this.playerService.findAll();

		return players.map((player) => new PlayerResponse(player));
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a Player!' })
	@ApiOperation({ summary: 'Create a World Cup' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(PlayerResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<PlayerResponse> {
		const player = await this.playerService.findByUuid(id);

		return new PlayerResponse(player);
	}
}
