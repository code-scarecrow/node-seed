import { registerAs } from '@nestjs/config';
import { IHttpCoreConfig } from './IHttpCoreConfig';
import { safeGetConfig } from '@code-scarecrow/base';

export const httpCoreConfig = registerAs('coreHttp', (): IHttpCoreConfig => {
	return {
		apiKey: safeGetConfig('CORE_API_KEY'),
		coreUrls: {
			AR: safeGetConfig('CORE_URL_AR'),
			CO: safeGetConfig('CORE_URL_CO'),
			UY: safeGetConfig('CORE_URL_UY'),
			MX: safeGetConfig('CORE_URL_MX'),
			CL: safeGetConfig('CORE_URL_CL'),
			PE: safeGetConfig('CORE_URL_PE'),
		},
	};
});
