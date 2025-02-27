import { It, Mock } from 'moq.ts';
import { IUOWRepositoryManager } from '@code-scarecrow/base/database';

export const createUOWRepositoryManagerMock = (): Mock<IUOWRepositoryManager> => {
	const uow: Mock<IUOWRepositoryManager> = new Mock();
	uow
		.setup((u) => u.runSafe(It.IsAny()))
		.callback(async (fn) => {
			await fn.args[0](uow.object());
		});
	return uow;
};
