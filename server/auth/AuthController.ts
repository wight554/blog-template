import { Response } from 'express';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Param,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';

import {
  AUTH_CONTROLLER_ROUTE,
  AUTH_LOGIN_ENDPOINT,
  AUTH_PUT_USER_ENDPOINT,
  AUTH_SIGNUP_ENDPOINT,
} from '@server/constants';
import { LocalAuthGuard } from '@server/auth/guards/LocalAuthGuard';
import { AuthService } from '@server/auth/AuthService';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { ReqRes } from '@server/decorators/ReqResDecorator';

@Controller(AUTH_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(UserType))
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(AUTH_LOGIN_ENDPOINT)
  async login(@ReqRes() res: Response, @User() user: UserType) {
    const cookie = this.authService.getCookieWithJwtToken(user.id);

    res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @Post(AUTH_SIGNUP_ENDPOINT)
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(AUTH_PUT_USER_ENDPOINT)
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserType,
  ) {
    if (user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.authService.updateUser(userId, updateUserDto);
  }
}
