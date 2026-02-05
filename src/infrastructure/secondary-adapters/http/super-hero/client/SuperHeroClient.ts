import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { httpSuperHeroConfig } from '../config/HttpSuperHeroConfig';
import { AxiosLoggerInterceptor } from 'src/base/logger';
import { AxiosInstanceFactory, HttpBaseClient } from 'src/base/http';

@Injectable()
export class SuperHeroClient extends HttpBaseClient {
	constructor(
		@Inject(httpSuperHeroConfig.KEY) config: ConfigType<typeof httpSuperHeroConfig>,
		axiosInterceptor: AxiosLoggerInterceptor,
		axiosFactory: AxiosInstanceFactory,
	) {
		super(config.url, axiosInterceptor, axiosFactory);
	}
}
