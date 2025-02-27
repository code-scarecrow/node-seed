import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AxiosLoggerInterceptor } from '@code-scarecrow/base/logger';
import { httpSuperHeroConfig } from '../config/HttpSuperHeroConfig';
import { AxiosInstanceFactory, PickitBaseClient } from '@code-scarecrow/base';

@Injectable()
export class SuperHeroClient extends PickitBaseClient {
	constructor(
		@Inject(httpSuperHeroConfig.KEY) config: ConfigType<typeof httpSuperHeroConfig>,
		axiosInterceptor: AxiosLoggerInterceptor,
		axiosFactory: AxiosInstanceFactory,
	) {
		super(config.url, axiosInterceptor, axiosFactory);
	}
}
