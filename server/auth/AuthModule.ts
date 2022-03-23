import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@server/auth/AuthController';
import { AuthService } from '@server/auth/AuthService';
import { JwtStrategy } from '@server/auth/strategies/JwtStrategy';
import { LocalStrategy } from '@server/auth/strategies/LocalStrategy';
import { CryptoModule } from '@server/crypto/CryptoModule';
import { UserModule } from '@server/user/UserModule';

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
