import { httpClient } from '@src/api/httpClient';
import { promiser } from '@src/api/promiser';
import { Post } from '@src/interfaces/model/Post';
import { handlePromiserResult } from '@src/utils/api';

enum PostRoutes {
  GET_ALL = '/api/v1/posts',
}

export const getPosts = async () => {
  const result = await promiser(httpClient.get<Array<Post>>(PostRoutes.GET_ALL));

  return handlePromiserResult(result);
};
