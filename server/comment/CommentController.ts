import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  COMMENT_CONTROLLER_ROUTE,
  COMMENT_DELETE_ENDPOINT,
  COMMENT_POST_ENDPOINT,
  COMMENT_PUT_ENDPOINT,
} from '@server/constants';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { Comment } from '@server/comment/schemas/CommentSchema';
import { CommentService } from '@server/comment/CommentService';
import { CreateCommentDto } from '@server/comment/dto/CreateCommentDto';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';

@Controller(COMMENT_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(Comment))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(COMMENT_POST_ENDPOINT)
  public createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserType,
  ) {
    return this.commentService.create(createCommentDto, postId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(COMMENT_PUT_ENDPOINT)
  public updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
    @User() user: UserType,
  ) {
    return this.commentService.update(id, updateCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(COMMENT_DELETE_ENDPOINT)
  public deleteComment(@Param('id') id: string, @User() user: UserType) {
    return this.commentService.delete(id, user.id);
  }
}
