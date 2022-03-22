import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';

import { User, UserDocument } from '@server/user/schemas/UserSchema';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { MongoErrorCode } from '@server/enums/MongoErrorCode';
import { CryptoService } from '@server/crypto/CryptoService';

@Injectable()
export class UserService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    let createdUser: UserDocument | null;

    try {
      const password = await this.cryptoService.hash(user.password, 10);
      const payload = { ...user, password };

      createdUser = await this.userModel.create(payload);
    } catch (error) {
      if (error instanceof MongoError && error.code === MongoErrorCode.DuplicateKey) {
        if (error.code === MongoErrorCode.DuplicateKey) {
          throw new BadRequestException('User with that username already exists');
        }
      }

      throw new InternalServerErrorException();
    }

    return createdUser;
  }

  async update(userId: string, user: UpdateUserDto): Promise<UserDocument> {
    let updatedUser: UserDocument | null;

    try {
      const password = user.password && (await this.cryptoService.hash(user.password, 10));
      const payload = { ...user, password };

      updatedUser = await this.userModel.findByIdAndUpdate(userId, payload, { new: true });
    } catch (error) {
      if (error instanceof MongoError && error.code === MongoErrorCode.DuplicateKey) {
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
