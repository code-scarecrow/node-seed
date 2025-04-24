import { DynamodbClient } from 'src/infrastructure/secondary-adapters/dynamodb/clients/DynamodbClient';
import { IDynamodbConfig } from 'src/infrastructure/secondary-adapters/dynamodb/config/IDynamodbConfig';
import { expect } from 'chai';

describe('Dynamo Client Test.', () => {
	it('Should return dynamo client.', () => {
		//Arrange
		const config: IDynamodbConfig = {
			region: 'us-test',
			accessKeyId: 'pickit-access-key-test',
			secretAccessKey: 'pickit-secret-access-key-test',
			rabbitTableName: '',
		};

		//Act
		const client = new DynamodbClient(config);

		//Assert
		expect(client).exist;
	});

	it('Should return dynamo client.', () => {
		//Arrange
		const config: IDynamodbConfig = {
			region: 'us-test',
			accessKeyId: 'pickit-access-key-test',
			secretAccessKey: 'pickit-secret-access-key-test',
			rabbitTableName: '',
			endpoint: 'test.com',
		};

		//Act
		const client = new DynamodbClient(config);

		//Assert
		expect(client).exist;
	});
});
