import { registerAs } from '@nestjs/config';
import { IDynamodbConfig } from './IDynamodbConfig';
import { safeGetConfig } from '@code-scarecrow/base';

export const dynamodbConfig = registerAs('dynamodb', (): IDynamodbConfig => {
	return {
		accessKeyId: safeGetConfig('AWS_ACCESS_KEY_ID'),
		secretAccessKey: safeGetConfig('AWS_SECRET_ACCESS_KEY'),
		endpoint: safeGetConfig('AWS_ENDPOINT'),
		region: safeGetConfig('AWS_REGION'),
		rabbitTableName: safeGetConfig('DYNAMODB_TABLE_NAME_RABBITS'),
	};
});
