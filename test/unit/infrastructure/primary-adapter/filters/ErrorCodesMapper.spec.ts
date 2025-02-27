import { ErrorCodesMapper } from 'src/infrastructure/primary-adapters/filters/ErrorCodesMapper';
import { ErrorCodesEnum } from 'src/domain/errors/ErrorCodesEnum';
import { expect } from 'chai';
import { HttpStatus } from '@nestjs/common';

describe('ErrorCodesMapper Test.', () => {
	it('should check all existing errors.', () => {
		//Arrange
		const errorMapper = new ErrorCodesMapper();
		const errorsToArray = Object.keys(ErrorCodesEnum).map((name) => {
			return ErrorCodesEnum[name as keyof typeof ErrorCodesEnum];
		});

		//Act
		const act = (): void => errorsToArray.forEach((e) => errorMapper.mapError(e));

		//Assert
		expect(act).not.throw;
	});

	it('should throw an error if the code i not present in the mapper.', () => {
		//Arrange
		const errorMapper = new ErrorCodesMapper();

		//Act
		const act = (): HttpStatus => errorMapper.mapError(2 as unknown as ErrorCodesEnum);

		//Assert
		expect(act).to.throw;
	});
});
