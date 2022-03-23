import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { CommentService } from '@server/comment/CommentService';
import { CreateCommentDto } from '@server/comment/dto/CreateCommentDto';
import { Comment } from '@server/comment/schemas/CommentSchema';
import {
  POST_CONTROLLER_ROUTE,
  POST_DELETE_ENDPOINT,
  POST_GET_ALL_ENDPOINT,
  POST_GET_ENDPOINT,
  POST_CREATE_COMMENT_ENDPOINT,
  POST_CREATE_ENDPOINT,
  POST_UPDATE_ENDPOINT,
} from '@server/constants/controllers';
import { User } from '@server/decorators/UserDecorator';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { PostService } from '@server/post/PostService';
import { CreatePostDto } from '@server/post/dto/CreatePostDto';
import { Post as PostType } from '@server/post/schemas/PostSchema';
import { User as UserType } from '@server/user/schemas/UserSchema';

@Controller(POST_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(PostType))
export class PostController {
  constructor(private postService: PostService, private commentService: CommentService) {}

  @Get(POST_GET_ALL_ENDPOINT)
  public getPosts() {
    return this.postService.getAll();
  }

  @Get(POST_GET_ENDPOINT)
  public getPost(@Param('id') id: string) {
    return this.postService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(POST_CREATE_ENDPOINT)
  public createPost(@Body() createPostDto: CreatePostDto, @User() user: UserType) {
    return this.postService.create(createPostDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(POST_UPDATE_ENDPOINT)
  public updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @User() user: UserType,
  ) {
    return this.postService.update(id, updatePostDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(POST_DELETE_ENDPOINT)
  public deletePost(@Param('id') id: string, @User() user: UserType) {
    return this.postService.delete(id, user.id);
  }

  @UseInterceptors(MongooseClassSerializerInterceptor(Comment))
  @UseGuards(JwtAuthGuard)
  @Post(POST_CREATE_COMMENT_ENDPOINT)
  public createPostComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: UserType,
  ) {
    return this.commentService.create(createCommentDto, id, user.id);
  }
}
