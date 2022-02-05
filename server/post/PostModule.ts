import { Module } from '@nestjs/common';

import { PostController } from '@server/post/PostController';

@Module({
  controllers: [PostController],
})
export class PostModule {}
