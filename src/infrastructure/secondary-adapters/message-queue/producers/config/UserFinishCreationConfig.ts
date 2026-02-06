import { registerAs } from '@nestjs/config';
import { getRequiredConfig } from 'src/base/nest/config';
import { IEventProducerConfig } from 'src/base/rabbit';

export const userFinishCreationConfig = registerAs('userfinishcreation', (): IEventProducerConfig => {
	return {
		exchange: getRequiredConfig('RABBIT_EVENT_BUS_EXCHANGE'),
	};
});
