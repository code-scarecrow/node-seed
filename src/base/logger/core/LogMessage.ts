import { LogLevels } from './LogLevels';

export interface LogMessage {
	timeStamp: Date;
	appName: string;
	traceId: string | undefined;
	level: LogLevels;
	levelName: string;
	message: string;
	metadata?: unknown;
}
