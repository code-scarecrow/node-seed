import { HttpStatus } from '@nestjs/common';
import { expect } from 'chai';
import { Request } from 'express';
import { Mock } from 'moq.ts';
import { parseNestRequest, parseNestResponse } from 'src/base/logger';

describe('Parser Test', () => {
	it('should parse nest request to correct format', () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.method).returns('GET');
		req.setup((r) => r.headers).returns({ host: 'test' });
		req.setup((r) => r.url).returns('https://test/test');
		req.setup((r) => r.body).returns({ test: 'test' });

		const expectedRes = {
			method: 'GET',
			domain: 'test',
			endpoint: 'https://test/test',
			headers: { host: 'test' },
			body: { test: 'test' },
		};

		//Act
		const res = parseNestRequest(req.object());

		//Assert
		expect(res).to.be.deep.equal(expectedRes);
	});

	it('should parse nest request to correct format without host', () => {
		//Arrange
		const req: Mock<Request> = new Mock();
		req.setup((r) => r.method).returns('GET');
		req.setup((r) => r.headers).returns({ host: 'test' });
		req.setup((r) => r.url).returns('https://test/test');
		req.setup((r) => r.body).returns({ test: 'test' });

		const expectedRes = {
			method: 'GET',
			domain: 'test',
			endpoint: 'https://test/test',
			headers: { host: 'test' },
			body: { test: 'test' },
		};

		//Act
		const res = parseNestRequest(req.object());

		//Assert
		expect(res).to.be.deep.equal(expectedRes);
	});

	it('should parse nest response to correct format', () => {
		//Arrange
		const expectedRes = {
			statusCode: HttpStatus.OK,
			body: { test: 'test' },
		};

		//Act
		const res = parseNestResponse(HttpStatus.OK, { test: 'test' });

		//Assert
		expect(res).to.be.deep.equal(expectedRes);
	});
});
