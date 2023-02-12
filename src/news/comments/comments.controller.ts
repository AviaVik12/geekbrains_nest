import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { Comment, CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/api/:idNews')
  create(@Param('idNews') idNews: string, @Body() comment: Comment) {
    const idNewsInt = parseInt(idNews);
    return this.commentService.create(idNewsInt, comment);
  }

  @Get('/api/details/:idNews')
  get(@Param('idNews') idNews: string) {
    const idNewsInt = parseInt(idNews);
    return this.commentService.find(idNewsInt);
  }

  @Delete('/api/details/:idNews/:idComment')
  remove(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
  ) {
    const idNewsInt = parseInt(idNews);
    const idCommentInt = parseInt(idComment);
    return this.commentService.remove(idNewsInt, idCommentInt);
  }
}
