import { It, Mock, Times } from 'moq.ts';
import { IUserCreateMessageProducer } from 'src/application/interfaces/IUserCreateMessageProducer';
import { IUserRepository } from 'src/application/interfaces/IUserRepository';
import { UserService } from 'src/application/services/UserService';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { expect } from 'chai';
import { IUserFinishCreationProducer } from 'src/application/interfaces/IUserFinishCreationProducer';

describe('User service test.', () => {
	let userService: UserService;
	let userRepository: Mock<IUserRepository>;
	let userCreateProducer: Mock<IUserCreateMessageProducer>;
	let userFinishCreationProducer: Mock<IUserFinishCreationProducer>;

	beforeEach(() => {
		userRepository = new Mock<IUserRepository>();
		userCreateProducer = new Mock<IUserCreateMessageProducer>();
		userFinishCreationProducer = new Mock<IUserFinishCreationProducer>();
		userService = new UserService(
			userCreateProducer.object(),
			userFinishCreationProducer.object(),
			userRepository.object(),
		);
	});

	it('should be defined.', () => {
		expect(userService).to.exist;
	});

	it('should create a user.', async () => {
		//Arrange
		const user = new UserEntity();

		userRepository.setup((ur) => ur.create(It.IsAny<UserEntity>())).returnsAsync(user);
		userFinishCreationProducer.setup((ur) => ur.send(It.IsAny<UserEntity>())).returns(undefined);

		//Act
		await userService.create(user);

		//Assert
		userRepository.verify((ur) => ur.create(user), Times.Once());
	});

	it('should return all users.', async () => {
		//Arrange
		const user = new UserEntity();

		userRepository.setup((ur) => ur.findAll()).returnsAsync([user]);

		//Act
		const response = await userService.findAll();

		//Assert
		userRepository.verify((ur) => ur.findAll(), Times.Once());

		response.forEach((u) => expect(u).instanceOf(UserEntity));
	});

	it('should send a user create message.', () => {
		//Arrange
		const user = new UserEntity();

		userCreateProducer.setup((ur) => ur.send(It.IsAny<UserEntity>())).returns(undefined);

		//Act
		userService.createMessage(user);

		//Assert
		userCreateProducer.verify((ur) => ur.send(It.IsAny<UserEntity>()), Times.Once());
	});
});
