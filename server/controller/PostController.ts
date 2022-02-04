import {
  BaseHttpController,
  controller,
  interfaces,
  results,
  httpGet,
} from 'inversify-express-utils';
import {
  POST_CONTROLLER_ROUTE,
  POST_GET_ALL_ENDPOINT,
} from '@server/constants';

@controller(POST_CONTROLLER_ROUTE)
export class PostController
  extends BaseHttpController
  implements interfaces.Controller
{
  @httpGet(POST_GET_ALL_ENDPOINT)
  public getPosts(): results.OkResult {
    return this.ok();
  }
}
