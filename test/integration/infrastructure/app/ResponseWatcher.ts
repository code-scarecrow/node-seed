import { HttpStatus } from '@nestjs/common';
import { CallbackHandler, Response } from 'supertest';

// This function allow us to see th error responses in the test logs when the test fails
// Only use it in tests that expects a successfull status code response
export function watch(status: number): CallbackHandler {
	const e1 = new Error();

	return (err: { status?: HttpStatus; text: string }, res: Response | undefined): void => {
		if ((res?.status || err.status) != status) {
			const e = new Error(
				`Expected ${status} ,got ${res?.status || err.status} resp: ${res?.body ? JSON.stringify(res.body) : err.text}`,
			);
			e.stack = concatErrorsStack(e1, e);
			throw e;
		}
	};
}

function concatErrorsStack(e1: Error, e2: Error): string {
	if (!e1.stack || !e2.stack) throw new Error('error stack not found');
	const s1 = e1.stack.split('\n');
	s1.splice(1, 1);

	return e2.stack.split('\n').splice(0, 1).concat(s1).join('\n');
}
