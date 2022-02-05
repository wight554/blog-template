import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from '@server/auth/AuthService';
import { UserModule } from '@server/user/UserModule';
import { LocalStrategy } from '@server/auth/strategies/LocalStrategy';
import { JwtStrategy } from '@server/auth/strategies/JwtStrategy';
import { AuthController } from '@server/auth/AuthController';
import { CryptoModule } from '@server/crypto/CryptoModule';

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
