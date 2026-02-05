import { LogMessage } from '../LogMessage';

export class ConsoleWritterLogMessage {
	public timeStamp: Date;
	public traceId: string | undefined;
	public appName: string;
	public level: string;
	public message: string;
	public metadata?: unknown;

	constructor(logMessage: LogMessage) {
		this.timeStamp = logMessage.timeStamp;
		this.traceId = logMessage.traceId;
		this.appName = logMessage.appName;
		this.level = logMessage.levelName;
		this.message = logMessage.message;
		this.metadata = logMessage.metadata;
	}
}
