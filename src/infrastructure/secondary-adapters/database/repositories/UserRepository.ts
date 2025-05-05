import { Injectable } from '@nestjs/common/decorators';
import { IUserRepository } from 'src/application/interfaces/IUserRepository';
import { User } from 'src/domain/entities/User';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../client/PrismaService';

@Injectable()
export class UserRepository implements IUserRepository {
	protected readonly repository: Prisma.usersDelegate<DefaultArgs>;

	constructor(prisma: PrismaService) {
		this.repository = prisma.users;
	}

	public async findAll(): Promise<User[]> {
		const res = await this.repository.findMany();

		return res.map((r) => {
			return new User(r);
		});
	}

	public async findByKey(key: { id: number }): Promise<User | null> {
		const res = await this.repository.findUnique({
			where: {
				id: key.id,
			},
		});

		if (!res) return null;

		return new User(res);
	}

	public async create(entity: User): Promise<User> {
		const res = await this.repository.create({
			data: {
				uuid: entity.uuid,
				name: entity.name,
				lastname: entity.lastname,
				dni: entity.dni,
				email: entity.email,
				password: entity.password,
				birthDate: entity.birthDate,
			},
		});

		return new User(res);
	}

	public async update(key: { id: number }, entity: User): Promise<User> {
		const user = await this.repository.update({
			where: {
				id: key.id,
			},
			data: {
				uuid: entity.uuid,
				name: entity.name,
				lastname: entity.lastname,
				dni: entity.dni,
				email: entity.email,
				password: entity.password,
				birthDate: entity.birthDate,
			},
		});

		return new User(user);
	}

	public async delete(key: { id: number }): Promise<void> {
		await this.repository.delete({
			where: {
				id: key.id,
			},
		});
	}
}
