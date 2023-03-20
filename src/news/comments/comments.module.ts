import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../../users/users.module';
import { NewsModule } from '../news.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsEntity } from './comments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => NewsModule),
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService, TypeOrmModule.forFeature([CommentsEntity])],
})
export class CommentsModule {}
