import { registerAs } from '@nestjs/config';
import { getRequiredConfig } from 'src/base/nest/config';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';

export const rabbitMQConfig = registerAs('rabittqueue', (): RabbitMQConfig => {
	return {
		uri: getRequiredConfig('RABBIT_URI'),
		connectionInitOptions: {
			wait: true,
			timeout: 30000,
		},
	};
});
