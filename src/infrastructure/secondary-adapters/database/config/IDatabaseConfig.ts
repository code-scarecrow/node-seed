export interface IDatabaseConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	entities: string[];
	migrations?: string[];
	autoloadEntities: boolean;
}
