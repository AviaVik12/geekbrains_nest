import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import { Comment, CommentEdit, CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/api/:idNews')
  create(@Param('idNews') idNews: string, @Body() comment: Comment) {
    const idNewsInt = parseInt(idNews);
    return this.commentService.create(idNewsInt, comment);
  }

  @Put('/api/:idNews/:idComment')
  edit(
    @Param('idNews') idNews: string,
    @Param('idComment') idComment: string,
    @Body() comment: CommentEdit,
  ) {
    const idNewsInt = parseInt(idNews);
    const idCommentInt = parseInt(idComment);
    return this.commentService.edit(idNewsInt, idCommentInt, comment);
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
