import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersEntity])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService, TypeOrmModule.forFeature([UsersEntity])],
})
export class UsersModule {}
