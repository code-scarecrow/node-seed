import { registerAs } from '@nestjs/config';
import { IDynamodbConfig } from './IDynamodbConfig';
import { getRequiredConfig } from 'src/base/nest/config';

export const dynamodbConfig = registerAs('dynamodb', (): IDynamodbConfig => {
	return {
		accessKeyId: getRequiredConfig('AWS_ACCESS_KEY_ID'),
		secretAccessKey: getRequiredConfig('AWS_SECRET_ACCESS_KEY'),
		endpoint: getRequiredConfig('AWS_ENDPOINT'),
		region: getRequiredConfig('AWS_REGION'),
		rabbitTableName: getRequiredConfig('DYNAMODB_TABLE_NAME_RABBITS'),
	};
});
