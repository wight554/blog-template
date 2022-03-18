import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CryptoService } from '@server/crypto/CryptoService';
import { UserService } from '@server/user/UserService';
import { ITokenPayload } from '@server/auth/interfaces/ITokenPayload';
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

  async getCookieWithJwtToken(userId: string): Promise<string> {
    const payload: ITokenPayload = { userId };
    const token = await this.jwtService.signAsync(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
