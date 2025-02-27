import { registerAs } from '@nestjs/config';
import { IHttpSuperHeroConfig } from './IHttpSuperHeroConfig';
import { safeGetConfig } from '@code-scarecrow/base';

export const httpSuperHeroConfig = registerAs('superHeroHttp', (): IHttpSuperHeroConfig => {
	return {
		url: safeGetConfig('SUPER_HERO_URL'),
	};
});
