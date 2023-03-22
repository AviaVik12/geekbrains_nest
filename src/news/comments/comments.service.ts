import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from '../../users/users.service';
import { NewsService } from '../news.service';
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
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly comments = {};

  async create(
    idNews: number,
    message: string,
    idUser: number,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);

    if (!_news) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Novostj ne najdena' },
        HttpStatus.NOT_FOUND,
      );
    }

    const _user = await this.userService.findById(idUser);

    if (!_user) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Poljzovatelj ne najden' },
        HttpStatus.NOT_FOUND,
      );
    }

    const commentEntity = new CommentsEntity();
    commentEntity.news = _news;
    commentEntity.user = _user;
    commentEntity.message = message;

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

  async remove(idComment: number): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: { id: idComment },
      relations: ['news'],
    });

    if (!_comment) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Kommentarij ne najden' },
        HttpStatus.NOT_FOUND,
      );
    }

    const comment = this.commentsRepository.remove(_comment);

    this.eventEmitter.emit('comment.remove', {
      commentId: idComment,
      newsId: _comment.newsId,
    });

    return comment;
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }
}
