import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      //   jwtFormRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFormRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  private static extractFromCookies(request: Request) {
    return request.cookies && 'jwt' in request.cookies
      ? request.cookies.jwt
      : null;
  }

  async validate(payload: any) {
    return { userId: payload.id };
  }
}
