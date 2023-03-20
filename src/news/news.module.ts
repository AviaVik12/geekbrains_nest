import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from './comments/comments.module';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsEntity } from './news.entity';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    CommentsModule,
    MailModule,
    UsersModule,
  ],
  exports: [TypeOrmModule.forFeature([NewsEntity]), NewsService],
})
export class NewsModule {}
