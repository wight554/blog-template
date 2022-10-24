import { useQuery } from '@tanstack/react-query';

import { httpClient } from '#src/api/httpClient.js';
import { Post } from '#src/interfaces/model/Post.js';

enum PostRoutes {
  GET_ALL = '/api/v1/posts',
}

export const usePosts = () => {
  return useQuery(
    ['posts'],
    () => httpClient.get<Array<Post>>(PostRoutes.GET_ALL).then((res) => res.data),
    {
      retry: 3,
      initialData: [],
    },
  );
};
