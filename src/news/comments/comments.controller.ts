import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HelperFileLoader } from '../../utils/helper_file_loader';
import { JwtAuthGuard } from '../../auth/jwt_auth.guard';
import { CreateCommentDto } from './dtos/create_comment_dto';
import { EditCommentDto } from './dtos/edit_comment_dto';
import { CommentsService } from './comments.service';

const PATH_NEWS = '/news_static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/api/:idNews')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
    @Req() request,
  ) {
    const jwtUserId = request.userId;
    return this.commentService.create(idNews, comment.message, jwtUserId);
  }

  @Put('/api/:idComment')
  edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: EditCommentDto,
  ) {
    return this.commentService.edit(idComment, comment);
  }

  @Get('/api/details/:idNews')
  get(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentService.findAll(idNews);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/details/:idNews/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number, @Req() request) {
    const userId = request.user.id;
    return this.commentService.remove(idComment, userId);
  }
}
