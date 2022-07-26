import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';

import { TokenPayload } from '#server/auth/interfaces/TokenPayload.js';
import { UserService } from '#server/user/UserService.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: (request: FastifyRequest): string | undefined => {
        return request?.cookies?.Authentication;
      },
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.getById(payload.userId);

    return user;
  }
}
