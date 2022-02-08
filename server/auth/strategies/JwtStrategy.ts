import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '@server/auth/interfaces/ITokenPayload';
import { UserService } from '@server/user/UserService';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    const user = await this.userService.getById(payload.userId);

    return user;
  }
}
