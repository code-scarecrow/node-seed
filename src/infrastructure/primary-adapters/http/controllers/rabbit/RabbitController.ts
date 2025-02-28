import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { RabbitService } from 'src/application/services/RabbitService';
import { RabbitResponse } from './response/RabbitResponse';
import { RabbitRequest } from './request/RabbitRequest';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('rabbits')
@ApiTags('Rabbits')
@ApiHeader({ name: 'Country-Code' })
export class RabbitController {
	constructor(private readonly rabbitService: RabbitService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a Rabbit' })
	@ApiResponse({ status: HttpStatus.CREATED, type: RabbitResponse })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() rabbitRequest: RabbitRequest): Promise<RabbitResponse> {
		const rabbit = await this.rabbitService.create(rabbitRequest.toEntity());

		return new RabbitResponse(rabbit);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a Rabbit' })
	@ApiResponse({ status: HttpStatus.OK, type: RabbitResponse })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(@Param('id') id: string, @Body() rabbit: RabbitRequest): Promise<RabbitResponse> {
		const updatedRabbit = await this.rabbitService.update({ ...rabbit.toEntity(), id });

		return new RabbitResponse(updatedRabbit);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Kill a Rabbit!' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id') id: string): Promise<void> {
		return this.rabbitService.delete(id);
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a Rabbit!' })
	@ApiResponse({ status: HttpStatus.OK, type: RabbitResponse })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id') id: string): Promise<Rabbit> {
		const rabbit = await this.rabbitService.findById(id);

		return new RabbitResponse(rabbit);
	}
}
