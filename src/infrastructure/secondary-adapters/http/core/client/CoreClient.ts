import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { httpCoreConfig } from '../config/HttpCoreConfig';
import { AxiosLoggerInterceptor } from '@code-scarecrow/base/logger';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { AxiosInstanceFactory, PickitBaseClient } from '@code-scarecrow/base';
import { ICoreUrls } from '../config/IHttpCoreConfig';

@Injectable()
export class CoreClient extends PickitBaseClient {
	private readonly coreUrls: ICoreUrls;

	constructor(
		@Inject(httpCoreConfig.KEY)
		config: ConfigType<typeof httpCoreConfig>,
		axiosInterceptor: AxiosLoggerInterceptor,
		axiosFactory: AxiosInstanceFactory,
	) {
		super('', axiosInterceptor, axiosFactory);
		this.httpClient.defaults.headers.common['APIKEY'] = config.apiKey;
		this.coreUrls = config.coreUrls;
	}

	public setCountry(countryCode: CountryCodeEnum): this {
		const coreUrl = this.coreUrls[countryCode];

		if (!coreUrl) {
			throw new Error(`Core url not found for country ${countryCode}`);
		}

		this.baseUrl = coreUrl;

		return this;
	}
}
