import { diskStorage } from 'multer';
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
	ParseIntPipe,
	UseGuards,
	Roles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '../auth/role/role.enum';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { HelperFileLoader } from '../utils/helper_file_loader';
import { MailService } from '../mail/mail.service';
import { CommentsService } from './comments/comments.service';
import { CreateNewsDto } from './dtos/create_news_dto';
import { EditNewsDto } from './dtos/edit_news_dto';
import { NewsService } from './news.service';
import { NewsEntity } from './news.entity';

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
	async get(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
		const news = this.newsService.findById(id);

		if (!news) {
			throw new HttpException(
				{ status: HttpStatus.NOT_FOUND, error: 'Novostj byla ne najdena' },
				HttpStatus.NOT_FOUND,
			);
		}

		return news;
	}

	@Get('/api/all')
	async getAll(): Promise<NewsEntity[]> {
		return this.newsService.getAll();
	}

	@Get('/all')
	@Render('news_list')
	async getAllView() {
		const news = await this.newsService.getAll();
		return { news, title: 'Spisok novostej' };
	}

	@Get('create/new')
	@Render('create_news')
	async createView() {
		return {};
	}

	@Get('/details/:id')
	@Render('news_details')
	async getDetailView(@Param('id', ParseIntPipe) id: number) {
		const news = await this.newsService.findById(id);

		if (!news) {
			throw new HttpException(
				{ status: HttpStatus.NOT_FOUND, error: 'Novostj byla ne najdena' },
				HttpStatus.NOT_FOUND,
			);
		}

		return news;
	}

	@UseGuards(JwtAuthGuard)
	@Roles(Role.Admin, Role.Moderator)
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
	): Promise<NewsEntity> {
		const fileExtension = cover.originalname.split('.').reverse()[0];

		if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/i)) {
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

		const createdNews = await this.newsService.create(news);

		return createdNews;
	}

	@Put('/api/:id')
	async edit(
		@Param('id', ParseIntPipe) id: number,
		@Body() news: EditNewsDto,
	): Promise<NewsEntity> {
		const newsEditable = await this.newsService.edit(id, news);

		if (!news) {
			throw new HttpException(
				{ status: HttpStatus.NOT_FOUND, error: 'Novostj byla ne najdena' },
				HttpStatus.NOT_FOUND,
			);
		}

		return newsEditable;
	}

	@Delete('/api/:id')
	async remove(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
		const isRemoved = await this.newsService.remove(id);

		throw new HttpException(
			{
				status: HttpStatus.OK,
				error: isRemoved ? 'Novostj udalena' : 'Peredan nevernyj identifikator',
			},
			HttpStatus.OK,
		);
	}
}
