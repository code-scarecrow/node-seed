import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { InfoResponse } from './response/InfoResponse';
import { version, seedVersion } from 'package.json';
import { ErrorResponse } from 'src/base/nest/errors';
import { getRequiredConfig } from 'src/base/nest/config';

@Controller('info')
@ApiTags('Info')
export class InfoController {
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get micro service info' })
	@ApiResponse({
		status: HttpStatus.OK,
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public getInfo(): InfoResponse {
		return new InfoResponse(getRequiredConfig('APP_NAME'), version, seedVersion);
	}
}
