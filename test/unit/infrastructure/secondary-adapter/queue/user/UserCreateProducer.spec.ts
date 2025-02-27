import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { QueueInterceptor } from '@code-scarecrow/base/logger';
import { It, Mock } from 'moq.ts';
import { UserEntity } from 'src/domain/entities/UserEntity';
import { UserCreateProducer } from 'src/infrastructure/secondary-adapters/message-queue/producers/user/UserCreateProducer';
import { expect } from 'chai';
import { IMessageProducerConfig } from '@code-scarecrow/base';

describe('User create producer test.', () => {
	let userCreateProducer: UserCreateProducer;
	let config: Mock<IMessageProducerConfig>;
	let amqpConnection: Mock<AmqpConnection>;
	let interceptor: Mock<QueueInterceptor>;

	const user: UserEntity = new UserEntity();
	user.name = 'Walter';
	user.lastname = 'Bou';
	user.dni = '32415234';
	user.birthDate = new Date('1993-08-25');
	user.email = 'walter@bou.com';
	user.password = 'qwerqwrsdf';

	beforeEach(() => {
		process.env['APP_NAME'] = 'test';
		config = new Mock<IMessageProducerConfig>();
		config.setup((m) => m.queue).returns('test');
		amqpConnection = new Mock<AmqpConnection>();
		interceptor = new Mock<QueueInterceptor>();
		userCreateProducer = new UserCreateProducer(config.object(), amqpConnection.object(), interceptor.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(userCreateProducer).exist;
	});

	it('should send a user entity.', () => {
		//Arrange
		interceptor.setup((m) => m.getTraceId()).returns('test');
		interceptor.setup((m) => m.logMessage(It.IsAny())).returns(undefined);
		amqpConnection.setup((m) => m.channel.sendToQueue(It.IsAny(), It.IsAny())).returns(true);

		//Act
		const response = userCreateProducer.send(user);

		//Assert
		expect(response).equal(undefined);
	});
});
