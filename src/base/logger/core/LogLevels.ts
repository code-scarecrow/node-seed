import { SafeMap } from '../../dataStructures/SafeMap';

export enum LogLevels {
	DEBUG,
	INFO,
	WARN,
	ERROR,
}

export const logLevelNames: SafeMap<LogLevels, string> = new SafeMap([
	[LogLevels.DEBUG, 'DEBUG'],
	[LogLevels.INFO, 'INFO'],
	[LogLevels.WARN, 'WARNING'],
	[LogLevels.ERROR, 'ERROR'],
]);
