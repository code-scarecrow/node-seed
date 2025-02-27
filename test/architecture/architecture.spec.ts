import { filesOfProject } from 'tsarch';
import { expect } from 'chai';

describe('architecture', () => {
	// we use async await in combination with jest since this project uses asynchronous calls
	it('application should not depend on the infraestructure', async () => {
		const res = await filesOfProject()
			.matchingPattern('src/application')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('src/infrastructure')
			.check();
		if (res.length !== 0) console.log(res);
		expect(res).to.be.empty;
	});

	it('domain should not depend on the infraestructure', async () => {
		const res = await filesOfProject()
			.matchingPattern('src/domain')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('src/infrastructure')
			.check();
		if (res.length !== 0) console.log(res);
		expect(res).to.be.empty;
	});

	it('domain should not depend on the application', async () => {
		const rule = filesOfProject()
			.matchingPattern('src/domain')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('src/application');
		const res = await rule.check();

		if (res.length !== 0) console.log(res);
		expect(res).to.be.empty;
	});

	it('primary infraestructure should not depend on the secondary infraestructure', async () => {
		const rule = filesOfProject()
			.matchingPattern('src/infrastructure/primary-adapters')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('src/infrastructure/secondary-adapters');
		const res = await rule.check();

		if (res.length !== 0) console.log(res);
		expect(res).to.be.empty;
	});

	it('secondary infraestructure should not depend on the primary infraestructure', async () => {
		const rule = filesOfProject()
			.matchingPattern('src/infrastructure/secondary-adapters')
			.shouldNot()
			.dependOnFiles()
			.matchingPattern('src/infrastructure/primary-adapters');
		const res = await rule.check();

		if (res.length !== 0) console.log(res);
		expect(res).to.be.empty;
	});
});
