import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PostController } from '@server/post/PostController';
import { PostService } from '@server/post/PostService';
import { Post, PostSchema } from '@server/post/schemas/PostSchema';
import { Comment, CommentSchema } from '@server/comment/schemas/CommentSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
