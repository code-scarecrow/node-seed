import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { config, Credentials, DynamoDB, Endpoint } from 'aws-sdk';
import { dynamodbConfig } from '../config/DynamodbConfig';

export class DynamodbClient extends DynamoDB.DocumentClient {
	constructor(
		@Inject(dynamodbConfig.KEY)
		dynamoConfig: ConfigType<typeof dynamodbConfig>,
	) {
		const awsEndpoint = dynamoConfig.endpoint ? new Endpoint(dynamoConfig.endpoint) : undefined;

		config.credentials = new Credentials({
			accessKeyId: dynamoConfig.accessKeyId,
			secretAccessKey: dynamoConfig.secretAccessKey,
		});

		config.update({ region: dynamoConfig.region });

		if (awsEndpoint) {
			super({
				endpoint: awsEndpoint,
			});
		} else {
			super();
		}
	}
}
