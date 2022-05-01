import {
  Controller,
  Post,
  UseGuards,
  Body,
  Put,
  Param,
  ForbiddenException,
  UseInterceptors,
  Get,
} from '@nestjs/common';

import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import {
  USER_CONTROLLER_ROUTE,
  USER_CREATE_ENDPOINT,
  USER_GET_ENDPOINT,
  USER_UPDATE_ENDPOINT,
} from '@server/constants/controllers';
import { User } from '@server/decorators/UserDecorator';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { UserService } from '@server/user/UserService';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { User as UserType } from '@server/user/schemas/UserSchema';

@Controller(USER_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(UserType))
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
