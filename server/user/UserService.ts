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

  async create(user: CreateUserDto): Promise<UserDocument> {
    let createdUser: UserDocument | null;

    try {
      createdUser = await this.userModel.create(user);
    } catch (error: any) {
      if (error?.code === MongoError.DuplicateKey) {
        throw new BadRequestException('User with that username already exists');
      }

      throw new InternalServerErrorException();
    }

    return createdUser;
  }

  async update(userId: string, user: UpdateUserDto): Promise<UserDocument> {
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

    return updatedUser;
  }

  async getByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
