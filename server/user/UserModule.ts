import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptoModule } from '@server/crypto/CryptoModule';
import { UserController } from '@server/user/UserController';
import { UserService } from '@server/user/UserService';
import { User, UserSchema } from '@server/user/schemas/UserSchema';

@Module({
  imports: [CryptoModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
