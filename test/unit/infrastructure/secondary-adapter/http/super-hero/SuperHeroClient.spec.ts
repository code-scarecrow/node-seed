import { AxiosLoggerInterceptor } from '@code-scarecrow/base/logger';
import { It, Mock } from 'moq.ts';
import { expect } from 'chai';
import { AxiosInstanceFactory } from '@code-scarecrow/base';
import { SuperHeroClient } from 'src/infrastructure/secondary-adapters/http/super-hero/client/SuperHeroClient';
import { IHttpSuperHeroConfig } from 'src/infrastructure/secondary-adapters/http/super-hero/config/IHttpSuperHeroConfig';

describe('Super Hero Client test.', () => {
	let superHeroClient: SuperHeroClient;
	let axiosInterceptor: Mock<AxiosLoggerInterceptor>;
	let axiosFactory: Mock<AxiosInstanceFactory>;
	const config: IHttpSuperHeroConfig = {
		url: 'test.com',
	};

	beforeEach(() => {
		axiosInterceptor = new Mock<AxiosLoggerInterceptor>();
		axiosFactory = new Mock<AxiosInstanceFactory>();
		axiosFactory.setup((m) => m.getInstance()).returns(It.IsAny());
		axiosInterceptor.setup((m) => m.configureClient(It.IsAny())).returns(It.IsAny());
		superHeroClient = new SuperHeroClient(config, axiosInterceptor.object(), axiosFactory.object());
	});

	it('should be defined.', () => {
		//Assert
		expect(superHeroClient).exist;
	});
});
