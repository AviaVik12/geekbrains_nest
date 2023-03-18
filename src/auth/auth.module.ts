import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '1h' },
		}),
		UsersModule,
		PassportModule,
	],
	providers: [
		{ provide: APP_GUARD, useClass: RolesGuard },
		AuthService,
		LocalStrategy,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
