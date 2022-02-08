import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';

import { POST_CONTROLLER_ROUTE, POST_GET_ALL_ENDPOINT, POST_GET_ENDPOINT } from '@server/constants';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { Post } from '@server/post/schemas/PostSchema';
import { PostService } from '@server/post/PostService';

@Controller(POST_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(Post))
export class PostController {
  constructor(private postService: PostService) {}

  @Get(POST_GET_ALL_ENDPOINT)
  public getPosts() {
    return this.postService.getAll();
  }

  @Get(POST_GET_ENDPOINT)
  public getPost(@Param('id') id: string) {
    return this.postService.getById(id);
  }
}
