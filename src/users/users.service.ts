import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { CreateUserDto } from './dtos/create_user_dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    return this.usersRepository.save(userEntity);
  }

  async findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
