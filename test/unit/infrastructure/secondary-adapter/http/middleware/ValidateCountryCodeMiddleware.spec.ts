import { Response, Request } from 'express';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';
import { ValidateCountryCodeMiddleware } from 'src/infrastructure/primary-adapters/http/middleware/ValidateCountryCodeMiddleware';
import { expect } from 'chai';
import { It, Mock } from 'moq.ts';

describe('Middleware for check country code header', () => {
	let validateCountryCodeMiddleware: ValidateCountryCodeMiddleware;
	let request: Mock<Request>;
	let response: Mock<Response>;

	beforeEach(() => {
		request = new Mock<Request>();
		response = new Mock<Response>();
		validateCountryCodeMiddleware = new ValidateCountryCodeMiddleware();
	});

	it('Valid country code', () => {
		//Arrange
		request.setup((m) => m.header('Country-Code')).returns(CountryCodeEnum.AR);

		//Act
		const result = validateCountryCodeMiddleware.use(request.object(), response.object(), () => true);

		//Assert
		expect(result).equal(undefined);
	});

	it('Invalid country code', () => {
		//Arrange
		request.setup((m) => m.header('Country-Code')).returns('TellDontAsk');

		//Act
		const result = (): void => validateCountryCodeMiddleware.use(request.object(), response.object(), () => true);

		//Assert
		expect(result).throw('Invalid Country-Code');
	});

	it('Country code not present', () => {
		//Act
		request.setup((m) => m.header(It.IsAny())).returns(undefined);

		const result = (): void => validateCountryCodeMiddleware.use(request.object(), response.object(), () => true);

		//Assert
		expect(result).throw('Country-Code is required');
	});
});
