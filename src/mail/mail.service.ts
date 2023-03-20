import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { News } from 'src/news/news.service';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTest() {
    console.log('Otpravläjetsä pisjmo ustanovki');

    return await this.mailerService
      .sendMail({
        to: 'air_vic@ukr.net',
        subject: 'Naşe pervoje pisjmo!',
        template: './test',
      })
      .then((response) => {
        console.log('response', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  async sendNewNewsForAdmins(emails: string[], news: News) {
    console.log('Otpravläjutsä pisjma o novoj novosti administraçii resursa');

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Sozdana novaja novostj: ${news.title}`,
          template: './new_news',
          context: news,
        })
        .then((response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }
}
