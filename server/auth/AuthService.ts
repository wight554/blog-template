import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { ITokenPayload } from '@server/auth/interfaces/ITokenPayload';
import { CreateUserDto } from '@server/user/dto/CreateUserDto';
import { UpdateUserDto } from '@server/user/dto/UpdateUserDto';
import { UserDocument } from '@server/user/schemas/UserSchema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDocument | null> {
    const user = await this.userService.getByUsername(username);

    const isPasswordMatch =
      user?.password && (await this.cryptoService.compare(pass, user.password));

    if (isPasswordMatch) {
      return user;
    }

    return null;
  }

  public getCookieWithJwtToken(userId: string): string {
    const payload: ITokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    const password = await this.cryptoService.hash(user.password, 10);

    const payload = { ...user, password };

    const createdUser = await this.userService.create(payload);

    return createdUser;
  }

  async updateUser(userId: string, user: UpdateUserDto): Promise<UserDocument> {
    const password = user.password && (await this.cryptoService.hash(user.password, 10));

    const payload = { ...user, password };

    const updatedUser = await this.userService.update(userId, payload);

    return updatedUser;
  }
}
