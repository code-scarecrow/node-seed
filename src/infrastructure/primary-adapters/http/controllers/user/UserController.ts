import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/application/services/UserService';
import { UserRequest } from './request/UserRequest';
import { UserResponse } from './response/UserResponse';
import { ErrorResponse } from '@code-scarecrow/base';

@Controller('users')
@ApiTags('Users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post()
	@ApiHeader({
		name: 'Country-Code',
		required: true,
	})
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Send message to create a user' })
	@ApiResponse({ status: HttpStatus.NO_CONTENT })
	@ApiBadRequestResponse({ type: ErrorResponse })
	public create(@Body() userRequest: UserRequest): void {
		return this.userService.createMessage(userRequest.toEntity());
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Get all Users' })
	@ApiResponse({
		status: HttpStatus.OK,
		type: UserResponse,
		isArray: true,
	})
	@ApiBadRequestResponse({ type: ErrorResponse })
	public async getAll(): Promise<UserResponse[]> {
		const users = await this.userService.findAll();

		return users.map((user) => new UserResponse(user));
	}
}
