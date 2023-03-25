import {
  Controller,
  UseGuards,
  Post,
  Request,
  Res,
  Get,
  Render,
} from '@nestjs/common';
import { LocalAuthGuard } from './local_auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() request,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('login');

    const { access_token, id } = await this.authService.login(request.user);

    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('userId', id);

    return access_token;
  }

  @Get('login')
  @Render('auth/login')
  async renderLogin() {
    return { layout: 'auth', title: 'Avtorizacija' };
  }
}
