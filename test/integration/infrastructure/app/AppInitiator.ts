import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { setUpPipeline, setUpPrefix, setUpSwagger } from 'src/AppConfigurator';
import { AppModule } from 'src/AppModule';

export async function initiateApp(): Promise<INestApplication> {
	const moduleFixture = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const app = moduleFixture.createNestApplication();
	setUpPipeline(app);
	setUpSwagger(app);
	setUpPrefix(app);

	return app.init();
}
