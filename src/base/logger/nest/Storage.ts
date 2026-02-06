import { AsyncLocalStorage } from 'node:async_hooks';

const storage: AsyncLocalStorage<string> = new AsyncLocalStorage();

export { storage };
