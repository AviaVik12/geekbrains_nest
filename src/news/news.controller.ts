import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Render,
} from '@nestjs/common';
import { News, NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { renderNewsAll } from '../views/news/news-all';
import { renderNewsDetail } from '../views/news/news-detail';
import { renderTemplate } from '../views/template';
import { CreateNewsDto } from './dtos/create_news_dto';
import { EditNewsDto } from './dtos/edit_news_dto';
import { HelperFileLoader } from 'src/utils/helper_file_loader';
import { MailService } from 'src/mail/mail.service';

const PATH_NEWS = '/news_static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('/api/details/:id')
  get(@Param('id') id: string): News {
    let idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    return { ...news, comments };
  }

  @Get('/api/all')
  getAll(): News[] {
    const news = this.newsService.getAll();
    return news;
  }

  @Get('/all')
  @Render('news_list')
  getAllView() {
    const news = this.newsService.getAll();
    return { news, title: 'Spisok novostej' };
  }

  @Get('create/new')
  @Render('create_news')
  async createView() {
    return {};
  }

  @Get('/details/:id')
  getDetailView(@Param('id') id: string) {
    const inInt = parseInt(id);
    const news = this.newsService.find(inInt);
    const comments = this.commentsService.find(inInt);

    const content = renderNewsDetail(news, comments);

    return renderTemplate(content, {
      title: news.title,
      description: news.description,
    });
  }

  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover,
  ): Promise<News> {
    const fileExtension = cover.originalname.split('.').reverse()[0];

    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Nevernyj format dannyx',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    const createdNews = this.newsService.create(news);
    await this.mailService.sendNewNewsForAdmins(
      ['air_vic@ukr.net', 'victor1207d@gmail.com'],
      createdNews,
    );
    return createdNews;
  }

  @Put('/api/:id')
  edit(@Param('id') id: string, @Body() news: EditNewsDto): News {
    const idInt = parseInt(id);
    return this.newsService.edit(idInt, news);
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    let idInt = parseInt(id);
    const isRemoved = this.newsService.remove(idInt);
    return isRemoved ? 'Novostj udalena' : 'Nevalidnyj identifikator';
  }
}
