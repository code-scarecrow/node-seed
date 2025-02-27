import { registerAs } from '@nestjs/config';
import { IMessageProducerConfig, safeGetConfig } from '@code-scarecrow/base';

export const userCreateQueueConfig = registerAs('usercreatequeue', (): IMessageProducerConfig => {
	return {
		queue: safeGetConfig('RABBIT_QUEUE'),
	};
});
