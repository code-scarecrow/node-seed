import { Logger, QueueInterceptor } from '@code-scarecrow/base/logger';
import { It, Mock, Times } from 'moq.ts';
import { UserService } from 'src/application/services/UserService';
import { User } from 'src/domain/entities/User';
import { UserCreateListener } from 'src/infrastructure/primary-adapters/message-queue/listeners/user/UserCreateListener';
import { expect } from 'chai';
import { IUserIncommingMessage } from 'src/infrastructure/primary-adapters/message-queue/listeners/user/IUserIncommingMessage';
import { RabbitMessage } from '@code-scarecrow/base';

describe('User create listener test.', () => {
	let userCreateListener: UserCreateListener;
	let userService: Mock<UserService>;
	let interceptor: Mock<QueueInterceptor>;
	let logger: Mock<Logger>;

	const messageBody: IUserIncommingMessage = {
		uuid: 'test',
		lastname: 'Bou',
		dni: '32415234',
		name: 'Walter',
		birthDate: new Date('1993-08-25'),
		email: 'walter@dou.com',
		password: 'qwerqwrsdf',
	};

	const message: RabbitMessage<IUserIncommingMessage> = new RabbitMessage(
		messageBody,
		'2314123412qweddfasdf',
		'ms-seed',
	);

	const user: User = new User();
	user.name = messageBody.name;
	user.lastname = messageBody.lastname;
	user.dni = messageBody.dni;
	user.birthDate = messageBody.birthDate;
	user.email = messageBody.email;
	user.password = messageBody.password;

	beforeEach(() => {
		userService = new Mock<UserService>();
		interceptor = new Mock<QueueInterceptor>();
		logger = new Mock<Logger>();
		userCreateListener = new UserCreateListener(userService.object(), interceptor.object(), logger.object());
	});

	it('should be defined.', () => {
		//Act
		expect(userCreateListener).exist;
	});

	it('should create a user.', async () => {
		//Arrange
		userService.setup((m) => m.create(It.IsAny())).returnsAsync(user);
		interceptor.setup((m) => m.logMessage(It.IsAny())).returns(undefined);

		//Act
		await userCreateListener.handleMessage(message);

		//Assert
		userService.verify((m) => m.create(It.IsAny()), Times.Once());
	});
});
