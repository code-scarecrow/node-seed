import { registerAs } from '@nestjs/config';
import { safeGetConfig } from '@code-scarecrow/base';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const rabbitMQConfig = registerAs('rabittqueue', (): RabbitMQConfig => {
	return {
		uri: safeGetConfig('RABBIT_URI'),
		connectionInitOptions: {
			wait: true,
			timeout: 30000,
		},
	};
});
