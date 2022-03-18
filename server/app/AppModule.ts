import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PostModule } from '@server/post/PostModule';
import { AuthModule } from '@server/auth/AuthModule';
import { CommentModule } from '@server/comment/CommentModule';

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
