import { httpClient } from '#src/api/httpClient.js';
import { promiser } from '#src/api/promiser.js';
import { Post } from '#src/interfaces/model/Post.js';
import { handlePromiserResult } from '#src/utils/api.js';

enum PostRoutes {
  GET_ALL = '/api/v1/posts',
}

export const getPosts = async () => {
  const result = await promiser(httpClient.get<Array<Post>>(PostRoutes.GET_ALL));

  return handlePromiserResult(result);
};
