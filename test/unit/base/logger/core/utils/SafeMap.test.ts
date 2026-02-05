import { expect } from 'chai';
import { SafeMap } from 'src/base/dataStructures/SafeMap';

describe('SafeMap Test', () => {
	it('should get exisisting result', () => {
		//Arrange
		const uut: SafeMap<string, string> = new SafeMap([['test', 'test']]);

		//Act
		const res = uut.get('test');

		//Assert
		expect(res).to.be.equal('test');
	});

	it('should throw exception as item is not found', () => {
		//Arrange
		const uut: SafeMap<string, string> = new SafeMap([]);

		//Act
		const getResult = (): string => uut.get('test');

		//Assert
		expect(getResult).to.throw();
	});
});
