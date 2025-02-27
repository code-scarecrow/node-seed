import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('health-check')
@ApiTags('Health check')
export class HealthCheckController {
	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Check health status' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public checkHealth(): void {
		return;
	}
}
