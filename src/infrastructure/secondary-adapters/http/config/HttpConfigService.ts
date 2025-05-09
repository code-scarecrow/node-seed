import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
	public createHttpOptions(): HttpModuleOptions {
		return {
			timeout: 5000,
			maxRedirects: 5,
		};
	}
}
