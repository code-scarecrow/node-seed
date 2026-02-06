import { registerAs } from '@nestjs/config';
import { IHttpSuperHeroConfig } from './IHttpSuperHeroConfig';
import { getRequiredConfig } from 'src/base/nest/config';

export const httpSuperHeroConfig = registerAs('superHeroHttp', (): IHttpSuperHeroConfig => {
	return {
		url: getRequiredConfig('SUPER_HERO_URL'),
	};
});
