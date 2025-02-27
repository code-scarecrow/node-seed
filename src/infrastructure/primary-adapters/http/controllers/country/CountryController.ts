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
import { CountryService } from 'src/application/services/CountryService';
import { CountryResponse } from './response/CountryResponse';
import { CountryRequest } from './request/CountryRequest';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('countries')
@ApiTags('Countries')
@ApiHeader({ name: 'Country-Code' })
@ApiExtraModels(CountryResponse)
export class CountryController {
	constructor(private countryService: CountryService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Create a Country' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(CountryResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async create(@Body() countryRequest: CountryRequest): Promise<CountryResponse> {
		const country = await this.countryService.create(countryRequest.toEntity());

		return new CountryResponse(country);
	}

	@Put(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Update a Country' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(CountryResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() countryRequest: CountryRequest,
	): Promise<CountryResponse> {
		const updatedCountry = await this.countryService.update(id, countryRequest.toEntity());

		return new CountryResponse(updatedCountry);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a Country' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.countryService.delete(id);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all Countries' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					type: 'array',
					items: { $ref: getSchemaPath(CountryResponse) },
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<CountryResponse[]> {
		const countries = await this.countryService.findAll();

		return countries.map((country) => new CountryResponse(country));
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get a Country' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(CountryResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<CountryResponse> {
		const country = await this.countryService.findByUuid(id);

		return new CountryResponse(country);
	}

	@Get(':id/players')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get Country players' })
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			properties: {
				result: {
					$ref: getSchemaPath(CountryResponse),
				},
			},
		},
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getCountryPlayers(@Param('id', ParseUUIDPipe) id: string): Promise<CountryResponse> {
		const countryPlayers = await this.countryService.getCountryPlayers(id);

		return new CountryResponse(countryPlayers);
	}
}
