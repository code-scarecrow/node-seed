import { Inject, Injectable } from '@nestjs/common';
import { DynamodbClient } from '../clients/DynamodbClient';
import { BaseDynamodbRepository } from './BaseDynamodbRepository';
import { dynamodbConfig } from '../config/DynamodbConfig';
import { ConfigType } from '@nestjs/config';
import { IRabbitRepository } from 'src/application/interfaces/IRabbitRepository';
import { Rabbit } from 'src/domain/entities/Rabbit';
import { v4 } from 'uuid';

@Injectable()
export class RabbitRepository extends BaseDynamodbRepository<{ id: string }, Rabbit> implements IRabbitRepository {
	constructor(
		@Inject(dynamodbConfig.KEY) dynamodbConfiguration: ConfigType<typeof dynamodbConfig>,
		client: DynamodbClient,
	) {
		super(client, dynamodbConfiguration.rabbitTableName);
	}

	public override async create(entity: Rabbit): Promise<Rabbit> {
		entity.id = v4();
		return await super.create(entity);
	}
}
