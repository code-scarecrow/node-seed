import { AsyncLocalStorage } from 'async_hooks';

const storage: AsyncLocalStorage<string> = new AsyncLocalStorage();

export { storage };
