import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentController } from '@server/comment/CommentController.js';
import { CommentService } from '@server/comment/CommentService.js';
import { Comment, CommentSchema } from '@server/comment/schemas/CommentSchema.js';
import { Post, PostSchema } from '@server/post/schemas/PostSchema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
