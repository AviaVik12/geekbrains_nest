import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  root() {
    return {
      messages: [
        { message: 'Privet', author: 'Vladislav' },
        { message: 'Mir', author: 'Ivan' },
      ],
    };
  }
}
