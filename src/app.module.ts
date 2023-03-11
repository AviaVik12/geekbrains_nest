import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { NewsEntity } from './news/news.entity';
import { UsersEntity } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Avi@V1k_psql',
      database: 'geekbrains_nest',
      // entities: ['dist/**/*.entity{.ts,.js}'],
      entities: [NewsEntity, UsersEntity],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    NewsModule,
    MailModule,
    UsersModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
