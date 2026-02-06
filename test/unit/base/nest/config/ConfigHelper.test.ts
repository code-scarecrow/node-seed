import { expect } from 'chai';
import { getRequiredConfig } from 'src/base/nest/config';

describe('safeGetConfig Test', () => {
	it('should return .env', () => {
		//Arrange
		process.env['TEST'] = 'TEST';

		//Act
		const res = getRequiredConfig('TEST');

		//Assert
		expect(res).to.be.equal('TEST');
	});

	it('should throw clear message exception', () => {
		//Act
		const getResponse = (): string => getRequiredConfig('JEST');

		//Assert
		expect(getResponse).to.throw('JEST is required in the environment variables');
	});
});
