import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { IncomingMessage, OutgoingMessage } from 'http';
import { v4 } from 'uuid';
import { storage } from './Storage';

@Injectable()
export class ContextInterceptor<T> implements NestInterceptor<T, Response<T>> {
	// TODO separar la logica de cada contexto en archivos distintos.
	public intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		if ('rmq' === `${context.getType()}`) {
			const req = context.switchToRpc().getData();
			const oldTraceId: string = req.traceId ?? this.generateTraceId();
			storage.enterWith(oldTraceId);
			return next.handle();
		}

		const req = context.switchToHttp().getRequest<IncomingMessage>();
		const res = context.switchToHttp().getResponse<OutgoingMessage>();
		const oldTraceId: string = this.getTraceId(req.headers['x-trace-id']) ?? this.generateTraceId();

		res.setHeader('x-trace-id', oldTraceId);
		storage.enterWith(oldTraceId);
		return next.handle();
	}

	private generateTraceId(): string {
		return v4();
	}

	private getTraceId(header: string | string[] | undefined): string | undefined {
		if (!header) {
			return undefined;
		}
		if (Array.isArray(header)) {
			return header[0];
		}
		return header;
	}
}
