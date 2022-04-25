import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@server/auth/AuthController.js';
import { AuthService } from '@server/auth/AuthService.js';
import { JwtStrategy } from '@server/auth/strategies/JwtStrategy.js';
import { LocalStrategy } from '@server/auth/strategies/LocalStrategy.js';
import { CryptoModule } from '@server/crypto/CryptoModule.js';
import { UserModule } from '@server/user/UserModule.js';

@Module({
  imports: [
    UserModule,
    CryptoModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
