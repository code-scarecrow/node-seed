import { ISingleEntityRepository } from '@code-scarecrow/base/database';
import { DynamodbClient } from '../clients/DynamodbClient';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export abstract class BaseDynamodbRepository<TKey extends { [key: string]: unknown }, TEntity extends TKey>
	implements ISingleEntityRepository<TKey, TEntity>
{
	constructor(private readonly client: DynamodbClient, protected tableName: string) {}

	public async update(_key: TKey, entity: TEntity): Promise<TEntity> {
		return this.create(entity);
	}

	public async delete(key: TKey): Promise<void> {
		const params: DocumentClient.DeleteItemInput = {
			TableName: this.tableName,
			Key: key,
		};
		await this.client.delete(params).promise();
	}

	public async create(entity: TEntity): Promise<TEntity> {
		const params = {
			TableName: this.tableName,
			Item: entity,
		};
		await this.client.put(params).promise();
		return entity;
	}

	public async findByKey(key: TKey): Promise<TEntity | null> {
		const params = {
			TableName: this.tableName,
			Key: key,
		};

		const result = await this.client.get(params).promise();
		if (result.Item) {
			return result.Item as TEntity;
		}

		return null;
	}
}
