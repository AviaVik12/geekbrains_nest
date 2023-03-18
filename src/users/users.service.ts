import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from '../utils/crypto';
import { CreateUserDto } from './dtos/create_user_dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersEntity)
		private usersRepository: Repository<UsersEntity>,
	) {}

	async create(user: CreateUserDto) {
		const userEntity = new UsersEntity();
		userEntity.firstName = user.firstName;
		userEntity.email = user.email;
		userEntity.password = await hash(user.password);
		userEntity.roles = user.roles;

		return this.usersRepository.save(userEntity);
	}

	async findById(id: number) {
		return this.usersRepository.findOne({ id });
	}

	async findByEmail(email): Promise<UsersEntity> {
		return await this.usersRepository.findOne({ email });
	}
}
