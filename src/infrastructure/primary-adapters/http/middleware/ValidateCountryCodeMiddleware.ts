import { Response, Request, NextFunction } from 'express';
import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { CountryCodeEnum } from 'src/domain/enums/CountryCodeEnum';

export class ValidateCountryCodeMiddleware implements NestMiddleware {
	public use(req: Request, _res: Response, next: NextFunction): void {
		const countryCode = req.header('Country-Code');

		if (!countryCode) {
			throw new BadRequestException('Country-Code is required');
		}

		const countries: string[] = Object.keys(CountryCodeEnum);

		if (!countries.includes(countryCode.toString())) {
			throw new BadRequestException('Invalid Country-Code');
		}
		next();
	}
}
