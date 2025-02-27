import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { DeleteItemInput, DocumentClient, GetItemInput, PutItemInput } from 'aws-sdk/clients/dynamodb';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { RabbitRacesEnum } from 'src/domain/enums/RabbitRaces';
import { IDynamodbConfig } from 'src/infrastructure/secondary-adapters/dynamodb/config/IDynamodbConfig';
import { RabbitRepository } from 'src/infrastructure/secondary-adapters/dynamodb/repositories/RabbitRepository';
import { expect } from 'chai';
import { Mock } from 'moq.ts';

describe('RabbitRepository test', () => {
	const dynamodbConfig: Mock<IDynamodbConfig> = new Mock();

	const rabbitExample: Rabbit = {
		id: 'test',
		name: 'test',
		age: 0,
		race: RabbitRacesEnum.AMERICAN,
	};

	beforeEach(() => {
		AWSMock.setSDKInstance(AWS);
	});

	afterEach(() => {
		AWSMock.restore('DynamoDB.DocumentClient');
	});

	describe('Get Rabbit by Key', () => {
		it('Rabbit not found', async () => {
			//Arrange
			AWSMock.mock(
				'DynamoDB.DocumentClient',
				'get',
				(_params: GetItemInput, callback: (a: null, b: unknown) => void) => {
					callback(null, { Item: null });
				},
			);
			const rabbitRepository = new RabbitRepository(dynamodbConfig.object(), new AWS.DynamoDB.DocumentClient());

			//Act
			const result = await rabbitRepository.findByKey({ id: 'test' });

			//Assert
			expect(result).null;
		});

		it('Rabbit exists', async () => {
			//Arrange
			AWSMock.mock(
				'DynamoDB.DocumentClient',
				'get',
				(_params: GetItemInput, callback: (a: null, b: DocumentClient.GetItemOutput) => void) => {
					callback(null, { Item: { ...rabbitExample } });
				},
			);
			const rabbitRepository = new RabbitRepository(dynamodbConfig.object(), new AWS.DynamoDB.DocumentClient());

			//Act
			const result = await rabbitRepository.findByKey({ id: 'test' });

			//Assert
			expect(result).deep.equal(rabbitExample);
		});
	});

	describe('Rabbit creation Test', () => {
		it('Create Rabbit', async () => {
			//Arrange
			const mockTable: unknown[] = [];
			AWSMock.mock(
				'DynamoDB.DocumentClient',
				'put',
				(_params: PutItemInput, callback: (a: null, b: unknown) => void) => {
					mockTable.push(_params.Item);
					callback(null, { Item: { ...rabbitExample } });
				},
			);
			const rabbitRepository = new RabbitRepository(dynamodbConfig.object(), new AWS.DynamoDB.DocumentClient());

			//Act
			const budgetResult = await rabbitRepository.create(rabbitExample);

			//Assert
			expect(budgetResult).equal(rabbitExample);
			expect(mockTable).contains(budgetResult);
		});
	});

	describe('Rabbit update Test', () => {
		it('Update Rabbit', async () => {
			//Arrange
			const mockTable: unknown[] = [];
			AWSMock.mock(
				'DynamoDB.DocumentClient',
				'put',
				(_params: PutItemInput, callback: (a: null, b: unknown) => void) => {
					mockTable.push(_params.Item);
					callback(null, { Item: { ...rabbitExample } });
				},
			);
			const rabbitRepository = new RabbitRepository(dynamodbConfig.object(), new AWS.DynamoDB.DocumentClient());

			//Act
			const budgetResult = await rabbitRepository.update({ id: rabbitExample.id }, rabbitExample);

			//Assert
			expect(budgetResult).equal(rabbitExample);
			expect(mockTable).contains(budgetResult);
		});
	});

	describe('Rabbit delete Test', () => {
		it('Delete Rabbit', async () => {
			//Arrange
			let mockTable: Rabbit[] = [rabbitExample];
			AWSMock.mock(
				'DynamoDB.DocumentClient',
				'delete',
				(params: DeleteItemInput, callback: (a: null, b: unknown) => void) => {
					mockTable = mockTable.filter((i) => i['id'] != params.Key['id']);
					callback(null, { Item: { ...rabbitExample } });
				},
			);
			const rabbitRepository = new RabbitRepository(dynamodbConfig.object(), new AWS.DynamoDB.DocumentClient());

			//Act
			await rabbitRepository.delete({ id: rabbitExample.id });

			//Assert
			expect(mockTable).not.contains(rabbitExample);
		});
	});
});
