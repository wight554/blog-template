import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '#server/auth/guards/JwtAuthGuard.js';
import { CommentService } from '#server/comment/CommentService.js';
import { UpdateCommentDto } from '#server/comment/dto/UpdateCommentDto.js';
import { Comment } from '#server/comment/schemas/CommentSchema.js';
import {
  COMMENT_CONTROLLER_ROUTE,
  COMMENT_DELETE_ENDPOINT,
  COMMENT_UPDATE_ENDPOINT,
} from '#server/constants/controllers.js';
import { User } from '#server/decorators/UserDecorator.js';
import { MongooseClassSerializerInterceptorFactory } from '#server/interceptors/MongooseClassSerializerInterceptorFactory.js';
import { User as UserType } from '#server/user/schemas/UserSchema.js';

@Controller(COMMENT_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptorFactory(Comment))
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Put(COMMENT_UPDATE_ENDPOINT)
  public updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserType,
  ) {
    return this.commentService.update(id, updateCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(COMMENT_DELETE_ENDPOINT)
  public deleteComment(@Param('id') id: string, @User() user: UserType) {
    return this.commentService.delete(id, user.id);
  }
}
