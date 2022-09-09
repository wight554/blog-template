import {
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

import { AuthService } from '#server/auth/AuthService.js';
import { JwtAuthGuard } from '#server/auth/guards/JwtAuthGuard.js';
import { LocalAuthGuard } from '#server/auth/guards/LocalAuthGuard.js';
import {
  AUTH_CONTROLLER_ROUTE,
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
} from '#server/constants/controllers.js';
import { User } from '#server/decorators/UserDecorator.js';
import { MongooseClassSerializerInterceptorFactory } from '#server/interceptors/MongooseClassSerializerInterceptorFactory.js';
import { User as UserType } from '#server/user/schemas/UserSchema.js';

@Controller(AUTH_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptorFactory(UserType))
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
