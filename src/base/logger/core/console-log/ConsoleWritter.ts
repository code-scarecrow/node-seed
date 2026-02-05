import { ConsoleWritterLogMessage } from './ConsoleWritterLogMessage';
import { IWritter } from '../IWritter';
import { LogLevels } from '../LogLevels';
import { LogMessage } from '../LogMessage';
import { SafeMap } from '../../../dataStructures/SafeMap';

const logStdOut = (message: string): void => console.log(message);
const logStdErr = (message: string): void => console.error(message);

interface LogLevel {
	output(message: string): void;
}

export class ConsoleWritter implements IWritter {
	private readonly logMethodMapper: SafeMap<LogLevels, LogLevel>;

	constructor() {
		this.logMethodMapper = new SafeMap<LogLevels, LogLevel>();
		this.logMethodMapper.set(LogLevels.DEBUG, { output: logStdOut });
		this.logMethodMapper.set(LogLevels.INFO, { output: logStdOut });
		this.logMethodMapper.set(LogLevels.WARN, { output: logStdErr });
		this.logMethodMapper.set(LogLevels.ERROR, { output: logStdErr });
	}

	public writeMessage(logMessage: LogMessage): void {
		this.logMethodMapper.get(logMessage.level).output(this.getLogString(logMessage));
	}

	private getLogString(logMessage: LogMessage): string {
		return JSON.stringify(new ConsoleWritterLogMessage(logMessage));
	}
}
