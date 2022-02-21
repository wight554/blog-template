import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentController } from '@server/comment/CommentController';
import { CommentService } from '@server/comment/CommentService';
import { Comment, CommentSchema } from '@server/comment/schemas/CommentSchema';
import { Post, PostSchema } from '@server/post/schemas/PostSchema';

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
