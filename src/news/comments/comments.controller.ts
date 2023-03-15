import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/helper_file_loader';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create_comment_dto';
import { EditCommentDto } from './dtos/edit_comment_dto';

const PATH_NEWS = '/news_static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('/api/:idNews')
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
  ) {
    return this.commentService.create(idNews, comment);
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

  @Delete('/api/details/:idNews/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number) {
    return this.commentService.remove(idComment);
  }
}
