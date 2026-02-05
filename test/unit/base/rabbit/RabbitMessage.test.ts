import { expect } from 'chai';
import { RabbitMessage } from 'src/base/rabbit';

describe('Logger Test', () => {
	it('should write correct message', () => {
		//Arrange
		const data = { test: 'test' };

		//Act
		const uut = new RabbitMessage(data, 'test123', 'testapp');

		//Assert
		expect(uut.data).to.be.equal(data);
		expect(uut.traceId).to.be.equal('test123');
		expect(uut.app).to.be.equal('testapp');
	});
});
