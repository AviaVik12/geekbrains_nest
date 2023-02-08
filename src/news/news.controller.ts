import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { News, NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/:id')
  get(@Param('id') id: string): News {
    let idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Post()
  create(@Body() news: News): News {
    return this.newsService.create(news);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): String {
    let idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'News were deleted' : 'Invalid ID passed';
  }
}
