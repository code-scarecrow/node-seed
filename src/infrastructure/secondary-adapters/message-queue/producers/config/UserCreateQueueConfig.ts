import { registerAs } from '@nestjs/config';
import { getRequiredConfig } from 'src/base/nest/config';
import { IMessageProducerConfig } from 'src/base/rabbit';

export const userCreateQueueConfig = registerAs('usercreatequeue', (): IMessageProducerConfig => {
	return {
		queue: getRequiredConfig('RABBIT_QUEUE'),
	};
});
