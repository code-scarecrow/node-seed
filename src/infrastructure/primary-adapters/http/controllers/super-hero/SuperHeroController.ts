import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiHeader, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SuperHeroResponse } from './response/SuperHeroResponse';
import { SuperHeroRequest } from './request/SuperHeroRequest';
import { SuperHeroService } from 'src/application/services/SuperHeroService';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('super-heroes')
@ApiTags('Super Heroes')
@ApiHeader({ name: 'Country-Code' })
export class SuperHeroController {
	constructor(private readonly superHeroService: SuperHeroService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a Super Hero' })
	@ApiResponse({ status: HttpStatus.CREATED })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() superHeroRequest: SuperHeroRequest): Promise<void> {
		await this.superHeroService.create(superHeroRequest.toEntity());
	}

	@Put(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Update a Super Hero' })
	@ApiResponse({ status: HttpStatus.OK })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(@Param('id') id: number, @Body() superHeroRequest: SuperHeroRequest): Promise<void> {
		await this.superHeroService.update({ ...superHeroRequest.toEntity(), id });
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a Super Hero' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id') id: number): Promise<void> {
		return this.superHeroService.delete(id);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a Super Hero' })
	@ApiResponse({ status: HttpStatus.OK, type: SuperHeroResponse })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id') id: number): Promise<SuperHeroResponse> {
		const superHero = await this.superHeroService.findById(id);

		return new SuperHeroResponse(superHero);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all Super Heroes' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			type: 'array',
			items: { $ref: getSchemaPath(SuperHeroResponse) },
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async get(): Promise<SuperHeroResponse[]> {
		const superHeros = await this.superHeroService.findAll();

		return superHeros.map((superHero) => new SuperHeroResponse(superHero));
	}
}
