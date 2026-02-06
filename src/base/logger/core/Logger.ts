import { IWritter } from './IWritter';
import { logLevelNames, LogLevels } from './LogLevels';
import { LogMessage } from './LogMessage';

export class Logger {
	private readonly writter: IWritter;
	private readonly minimumLogLevel: LogLevels;
	private readonly appName: string;
	private readonly getTraceId: () => string | undefined;

	constructor(minimumLogLevel: LogLevels, appName: string, writter: IWritter, getTraceId: () => string | undefined) {
		this.minimumLogLevel = minimumLogLevel;
		this.writter = writter;
		this.appName = appName;
		this.getTraceId = getTraceId;
	}

	private getLogMessage(message: string, level: LogLevels, metadata?: unknown, traceId?: string): LogMessage {
		return {
			timeStamp: new Date(),
			appName: this.appName,
			traceId: traceId ?? this.getTraceId(),
			level: level,
			levelName: logLevelNames.get(level),
			message: message,
			metadata: metadata,
		};
	}

	private log(message: string, level: LogLevels, metadata?: unknown, traceId?: string): void {
		if (level < this.minimumLogLevel) return;
		this.writter.writeMessage(this.getLogMessage(message, level, metadata, traceId));
	}

	public debug(message: string, metadata?: unknown, traceId?: string): void {
		this.log(message, LogLevels.DEBUG, metadata, traceId);
	}

	public info(message: string, metadata?: unknown, traceId?: string): void {
		this.log(message, LogLevels.INFO, metadata, traceId);
	}

	public warn(message: string, metadata?: unknown, traceId?: string): void {
		this.log(message, LogLevels.WARN, metadata, traceId);
	}

	public error(message: string, metadata?: unknown, traceId?: string): void {
		this.log(message, LogLevels.ERROR, metadata, traceId);
	}
}
