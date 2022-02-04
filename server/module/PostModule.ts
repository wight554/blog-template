import { Module } from '@nestjs/common';
import { PostController } from '@server/controller/PostController';

@Module({
  controllers: [PostController],
})
export class PostModule {}
