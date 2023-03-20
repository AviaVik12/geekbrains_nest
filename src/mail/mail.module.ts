import { join } from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://air_vic@ukr.net:ArsMALdTL4NdT1HV@smtp.ukr.net',
      defaults: { from: '"NestJS Robot" <air_vic@ukr.net>' },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
