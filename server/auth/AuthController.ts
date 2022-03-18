import { FastifyReply } from 'fastify';
import { Controller, Post, UseGuards, UseInterceptors, Res } from '@nestjs/common';

import { AUTH_CONTROLLER_ROUTE, AUTH_LOGIN_ENDPOINT } from '@server/constants/controllers';
import { LocalAuthGuard } from '@server/auth/guards/LocalAuthGuard';
import { AuthService } from '@server/auth/AuthService';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';

@Controller(AUTH_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(UserType))
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(AUTH_LOGIN_ENDPOINT)
  async login(@Res({ passthrough: true }) res: FastifyReply, @User() user: UserType) {
    const cookie = await this.authService.getCookieWithJwtToken(user.id);

    res.header('Set-Cookie', cookie);

    return user;
  }
}
