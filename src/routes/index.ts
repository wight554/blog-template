import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction } from 'react-router-dom';

import { promiser } from '#src/api/promiser.js';
import { postsQuery } from '#src/services/post.js';

export const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    if (!queryClient.getQueryData(postsQuery.queryKey)) {
      await promiser(queryClient.fetchQuery(postsQuery));
    }
  };

export { PostsList as Index } from '#src/components/PostsList/index.js';
