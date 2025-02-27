import { DataSource, EntityTarget, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';

export async function insert<Entity>(datasource: DataSource, arg: Entity[]): Promise<Entity[]> {
	return datasource.manager.save(arg);
}

export async function deleteAll(datasource: DataSource, entity: EntityTarget<ObjectLiteral>): Promise<void> {
	await datasource.manager.delete(entity, {});
}

export async function findOneBy<Entity extends ObjectLiteral>(
	datasource: DataSource,
	entity: EntityTarget<Entity>,
	where: FindOptionsWhere<Entity>,
): Promise<Entity | null> {
	return datasource.manager.findOneBy(entity, where);
}

export async function findOneWithRelations<Entity extends ObjectLiteral>(
	datasource: DataSource,
	entity: EntityTarget<Entity>,
	conditions: FindOneOptions<Entity>,
): Promise<Entity | null> {
	return datasource.manager.findOne(entity, conditions);
}
