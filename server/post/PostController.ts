import { Controller, Get } from '@nestjs/common';

import { POST_CONTROLLER_ROUTE, POST_GET_ALL_ENDPOINT } from '@server/constants';

@Controller(POST_CONTROLLER_ROUTE)
export class PostController {
  @Get(POST_GET_ALL_ENDPOINT)
  public getPosts() {
    return 'OK';
  }
}
