import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { promiser } from '#src/api/promiser.js';
import { Post } from '#src/interfaces/model/Post.js';
import { handleApiError } from '#src/utils/api.js';

export enum PostRoutes {
  GET_ALL = '/api/v1/posts',
}

const getPosts = async () => {
  const [response, error] = await promiser(httpClient.get<Array<Post>>(PostRoutes.GET_ALL));

  if (response) {
    return response.data;
  }

  if (error) {
    return handleApiError(error);
  }
};

export const postsQuery = {
  queryKey: ['posts'],
  queryFn: () => getPosts(),
  retry: 3,
};

export const usePosts = () => {
  return useQuery(postsQuery);
};
