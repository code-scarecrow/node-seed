import axios from 'axios';
import { CoreClient } from 'src/infrastructure/secondary-adapters/http/core/client/CoreClient';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { Logger, AxiosLoggerInterceptor } from '@code-scarecrow/base/logger';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { It, Mock } from 'moq.ts';
import { AxiosInstanceFactory } from '@code-scarecrow/base';

describe('Core Client Test.', () => {
	let client: CoreClient;
	const axiosAdapter = new MockAdapter(axios);
	let logger: Mock<Logger>;

	beforeEach(() => {
		const config = {
			apiKey: 'TestApiKey',
			coreUrls: {
				AR: 'http://test-url.ar',
				CL: 'http://test-url.cl',
				CO: 'http://test-url.co',
				MX: 'http://test-url.mx',
				PE: 'http://test-url.pe',
				UY: 'http://test-url.uy',
			},
		};

		logger = new Mock<Logger>();
		logger.setup((m) => m.info(It.IsAny())).returns(undefined);

		client = new CoreClient(config, new AxiosLoggerInterceptor(logger.object()), new AxiosInstanceFactory());
	});

	afterEach(() => {
		axiosAdapter.reset();
	});

	it('Test get method.', async () => {
		//Arrange
		const response = {
			test: 'test',
		};
		axiosAdapter.onGet('http://test-url.ar/get').reply(200, response);

		//Act
		const result = await client.setCountry(CountryCodeEnum.AR).get('/get');

		//Assert
		expect(result).deep.equal(response);
		expect(axiosAdapter.history['get']?.[0]?.url).equal('http://test-url.ar/get');
	});

	it('Test post method.', async () => {
		//Arrange
		const response = { pickitCode: 'ABC ' };
		axiosAdapter.onPost('http://test-url.ar/post').reply(200, response);

		//Act
		const result = await client.setCountry(CountryCodeEnum.AR).post('/post', response);

		//Assert
		expect(result).deep.equal(response);
		expect(axiosAdapter.history['post']?.[0]?.url).equal('http://test-url.ar/post');
		expect(axiosAdapter.history['post']?.[0]?.data).equal(JSON.stringify(response));
	});

	it('Test put method.', async () => {
		//Arrange
		const payload = { pickitCode: 'ABC ' };
		axiosAdapter.onPut('http://test-url.ar/put').reply(200, payload);

		//Act
		const result = await client.setCountry(CountryCodeEnum.AR).put('/put', payload);

		//Assert
		expect(result).deep.equal(payload);
		expect(axiosAdapter.history['put']?.[0]?.url).equal('http://test-url.ar/put');
		expect(axiosAdapter.history['put']?.[0]?.data).equal(JSON.stringify(payload));
	});

	it('Test delete method.', async () => {
		//Arrange
		axiosAdapter.onDelete('http://test-url.ar/delete').reply(204);

		//Act
		await client.setCountry(CountryCodeEnum.AR).delete('/delete');

		//Assert
		expect(axiosAdapter.history['delete']?.[0]?.url).equal('http://test-url.ar/delete');
	});

	it('Test correct header for authentication required in Core.', async () => {
		//Arrange
		const response = { pickitCode: 'ABC ' };
		axiosAdapter.onGet('http://test-url.ar/get').reply(200, response);

		//Act
		await client.setCountry(CountryCodeEnum.AR).get('/get');

		//Assert
		expect(axiosAdapter.history['get']?.[0]?.headers?.['APIKEY']).equal('TestApiKey');
	});

	it('Should throw if country code is not set.', () => {
		const invalidCountryCode = 'invalid-code' as CountryCodeEnum;

		const act = (): CoreClient => client.setCountry(invalidCountryCode);

		expect(act).to.throw(`Core url not found for country ${invalidCountryCode}`);
	});
});
