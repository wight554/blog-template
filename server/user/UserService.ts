import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@server/user/schemas/UserSchema';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { MongoError } from '@server/enums/EMongoError';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);

    try {
      await createdUser.save();
    } catch (error: any) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new BadRequestException('User with that username already exists');
      }

      throw new InternalServerErrorException();
    }

    return createdUser.toJSON();
  }

  async update(userId: string, user: UpdateUserDto): Promise<User> {
    let updatedUser: UserDocument | null;

    try {
      updatedUser = await this.userModel.findOneAndUpdate({ _id: userId }, user, {
        new: true,
      });
    } catch (error: any) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new BadRequestException('User with that username already exists');
      }

      throw new InternalServerErrorException();
    }

    if (!updatedUser) {
      throw new NotFoundException();
    }

    return updatedUser.toJSON();
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException();
    }

    return user.toJSON();
  }

  async getById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return user.toJSON();
  }
}
