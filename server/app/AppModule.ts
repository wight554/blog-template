import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@server/auth/AuthModule.js';
import { CommentModule } from '@server/comment/CommentModule.js';
import { PostModule } from '@server/post/PostModule.js';

@Module({
  imports: [
    AuthModule,
    PostModule,
    CommentModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
  ],
})
export class AppModule {}
