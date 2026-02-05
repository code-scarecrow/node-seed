import { fail } from 'assert';
import { expect } from 'chai';
import { Validator } from 'class-validator';
import { IsBefore } from 'src/base/nest/decorators';

const validator = new Validator();

describe('IsBefore decorator test', () => {
	class TestClas {
		@IsBefore('finishDate')
		public startDate: string;

		public finishDate: string | undefined;

		constructor(start: string, finish: string | undefined) {
			this.startDate = start;
			this.finishDate = finish;
		}
	}

	it('should say validation is correct', async () => {
		//Arrange
		const model = new TestClas('2023-1-1', '2024-1-1');

		//Act
		const res = await validator.validate(model);

		//Assert
		expect(res.length).to.be.equal(0);
	});

	it('should return correct error msg', async () => {
		//Arrange
		const model = new TestClas('2024-1-1', '2023-1-1');

		//Act
		const res = await validator.validate(model);

		//Assert
		expect(res.length).to.be.equal(1);
		if (!res[0] || !res[0].constraints) fail('undefined result');
		expect(res[0].constraints['isBefore']).to.be.equal("The 'startDate' must be before the 'finishDate'");
	});

	it('should return missing propperty error msg', async () => {
		//Arrange
		const model = new TestClas('2024-1-1', undefined);

		//Act
		const res = await validator.validate(model);

		//Assert
		expect(res.length).to.be.equal(1);
		if (!res[0] || !res[0].constraints) fail('undefined result');
		expect(res[0].constraints['isBefore']).to.be.equal("Propperty 'finishDate' not found.");
	});
});
