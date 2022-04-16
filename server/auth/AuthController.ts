import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  HttpStatus,
  HttpCode,
  Header,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { AuthService } from '@server/auth/AuthService';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { LocalAuthGuard } from '@server/auth/guards/LocalAuthGuard';
import {
  AUTH_CONTROLLER_ROUTE,
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
} from '@server/constants/controllers';
import { User } from '@server/decorators/UserDecorator';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { User as UserType } from '@server/user/schemas/UserSchema';

@Controller(AUTH_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(UserType))
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AUTH_LOGIN_ENDPOINT)
  async login(@Res({ passthrough: true }) res: FastifyReply, @User() user: UserType) {
    const cookie = await this.authService.getCookieWithJwtToken(user.id);

    res.header('Set-Cookie', cookie);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Header('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0')
  @Post(AUTH_LOGOUT_ENDPOINT)
  async logout() {}
}
