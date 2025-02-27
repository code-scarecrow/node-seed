import { registerAs } from '@nestjs/config';
import { IEventProducerConfig, safeGetConfig } from '@code-scarecrow/base';

export const userFinishCreationConfig = registerAs('userfinishcreation', (): IEventProducerConfig => {
	return {
		exchange: safeGetConfig('RABBIT_EVENT_BUS_EXCHANGE'),
	};
});
