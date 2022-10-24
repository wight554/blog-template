import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { Post } from '#src/interfaces/model/Post.js';

export enum PostRoutes {
  GET_ALL = '/api/v1/posts',
}
const getPosts = () => httpClient.get<Array<Post>>(PostRoutes.GET_ALL).then((res) => res.data);

export const postsQuery = {
  queryKey: ['posts'],
  queryFn: () => getPosts(),
  retry: 3,
};

export const usePosts = () => {
  return useQuery(postsQuery);
};
