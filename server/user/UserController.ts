import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '#server/auth/guards/JwtAuthGuard.js';
import {
  USER_CONTROLLER_ROUTE,
  USER_CREATE_ENDPOINT,
  USER_GET_ENDPOINT,
  USER_UPDATE_ENDPOINT,
} from '#server/constants/controllers.js';
import { User } from '#server/decorators/UserDecorator.js';
import { MongooseClassSerializerInterceptorFactory } from '#server/interceptors/MongooseClassSerializerInterceptorFactory.js';
import { CreateUserDto } from '#server/user/dto/CreateUserDto.js';
import { UpdateUserDto } from '#server/user/dto/UpdateUserDto.js';
import { User as UserType } from '#server/user/schemas/UserSchema.js';
import { UserService } from '#server/user/UserService.js';

@Controller(USER_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptorFactory(UserType))
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(USER_GET_ENDPOINT)
  async get(@User() user: UserType) {
    return this.userService.getById(user.id);
  }

  @Post(USER_CREATE_ENDPOINT)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(USER_UPDATE_ENDPOINT)
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserType,
  ) {
    if (user.id !== userId) {
      throw new ForbiddenException();
    }

    return this.userService.update(userId, updateUserDto);
  }
}
