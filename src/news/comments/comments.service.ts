import { Repository } from 'typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';
import { CreateCommentDto } from './dtos/create_comment_dto';
import { CommentsEntity } from './comments.entity';

export type Comment = {
	id?: number;
	message: string;
	author: string;
};

export type CommentEdit = {
	id?: number;
	message?: string;
	author?: string;
};

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentsEntity)
		private readonly commentsRepository: Repository<CommentsEntity>,
		private readonly newsService: NewsService,
		private readonly userService: UsersService,
	) {}

	private readonly comments = {};

	async create(
		idNews: number,
		comment: CreateCommentDto,
	): Promise<CommentsEntity> {
		const _news = await this.newsService.findById(idNews);

		if (!_news) {
			throw new HttpException(
				{ status: Http.NOT_FOUND, error: 'Novostj ne najdena' },
				Http.NOT_FOUND,
			);
		}

		const _user = await this.userService.findById(comment.userId);

		if (!_user) {
			throw new HttpException(
				{ status: Http.NOT_FOUND, error: 'Poljzovatelj ne najden' },
				Http.NOT_FOUND,
			);
		}

		const commentEntity = new CommentsEntity();
		commentEntity.news = _news;
		commentEntity.user = _user;
		commentEntity.message = comment.message;

		return this.commentsRepository.save(commentEntity);
	}

	async edit(idComment: number, comment: CommentEdit): Promise<CommentsEntity> {
		const _comment = await this.commentsRepository.findOne(idComment);
		_comment.message = comment.message;

		return this.commentsRepository.save(_comment);
	}

	async findAll(idNews: number): Promise<CommentsEntity> {
		return this.commentsRepository.find({
			where: { news: idNews },
			relations: ['user'],
		});
	}

	async remove(idNews: number, idComment: number): Promise<CommentsEntity> {
		const _comment = await this.commentsRepository.findOne(idComment);

		if (!_comment) {
			throw new HttpException(
				{ status: Http.NOT_FOUND, error: 'Kommentarij ne najden' },
				Http.NOT_FOUND,
			);
		}

		const indexComment = this.comments[idNews].findIndex(
			(c) => c.id === idComment,
		);

		if (indexComment === -1) {
			return null;
		}

		return this.commentsRepository.remove(_comment);
	}

	async removeAll(idNews) {
		const _comments = await this.findAll(idNews);
		return await this.commentsRepository.remove(_comments);
	}
}
