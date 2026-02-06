import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { IRabbitMessage } from 'src/base/rabbit';

interface RequestMetadata {
	method: string;
	domain: string | null;
	endpoint: string;
	headers: unknown;
	body: unknown;
}

interface RequestMqpMetadata {
	data: unknown;
	timestamp: string;
	app: string;
}

export function parseNestRequest(req: Request): RequestMetadata {
	return {
		method: req.method,
		domain: req.headers.host ?? null,
		endpoint: req.url,
		headers: req.headers,
		body: req.body,
	};
}

export function parseMqpRequest(req: IRabbitMessage<unknown>): RequestMqpMetadata {
	return {
		data: req.data,
		timestamp: req.timestamp.toString(),
		app: req.app,
	};
}

interface ResponseMetadata {
	statusCode: HttpStatus;
	body: unknown;
}

export function parseNestResponse(status: HttpStatus, body: unknown): ResponseMetadata {
	return {
		statusCode: status,
		body: body,
	};
}
