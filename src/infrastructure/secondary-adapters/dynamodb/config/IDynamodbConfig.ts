export interface IDynamodbConfig {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	endpoint?: string;
	rabbitTableName: string;
}
