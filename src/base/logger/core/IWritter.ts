import { LogMessage } from './LogMessage';

export interface IWritter {
	writeMessage(logMessage: LogMessage): void;
}
