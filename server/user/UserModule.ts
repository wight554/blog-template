import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '@server/user/UserService';
import { User, UserSchema } from '@server/user/schemas/UserSchema';
import { UserController } from '@server/user/UserController';
import { CryptoModule } from '@server/crypto/CryptoModule';

@Module({
  imports: [CryptoModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
