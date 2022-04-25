import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptoModule } from '@server/crypto/CryptoModule.js';
import { UserController } from '@server/user/UserController.js';
import { UserService } from '@server/user/UserService.js';
import { User, UserSchema } from '@server/user/schemas/UserSchema.js';

@Module({
  imports: [CryptoModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
