import { LogLevels } from '../core/LogLevels';

export class LoggerConfig {
	public readonly appName: string;
	public readonly minimumLogLevel: number;

	constructor(appName: string, minimumLogLevel: number = LogLevels.INFO) {
		this.appName = appName;
		this.minimumLogLevel = minimumLogLevel;
	}
}
