import {
  Body,
  Controller,
  Post,
  Get,
  Render,
  Param,
  ParseIntPipe,
  Req,
  Patch,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { CreateUserDto } from './dtos/create_user_dto';
import { EditUserDto } from './dtos/edit_user_dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/api')
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Get('edit-profile/:id')
  @Render('user/edit_profile')
  async renderEditProfile(
    @Param('id', ParseIntPipe) id: number,
    @Req() request,
  ) {
    const _user = await this.usersService.findById(id);

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Nevernyj identifikator poljzovatelä',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return _user;
  }

  @Patch('api')
  @UseGuards(JwtAuthGuard)
  async edit(@Body() user: EditUserDto, @Req() request) {
    const jwtUserId = request.user.userId;
    return this.usersService.edit(jwtUserId, user);
  }
}
