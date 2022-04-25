import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentService } from '@server/comment/CommentService.js';
import { Comment, CommentSchema } from '@server/comment/schemas/CommentSchema.js';
import { PostController } from '@server/post/PostController.js';
import { PostService } from '@server/post/PostService.js';
import { Post, PostSchema } from '@server/post/schemas/PostSchema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, CommentService],
  exports: [PostService],
})
export class PostModule {}
