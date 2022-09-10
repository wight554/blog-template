import { atom, selector } from 'recoil';

import { Post } from '#src/interfaces/model/Post.js';
import { getPosts } from '#src/services/post.js';

const postsQuery = selector<Array<Post> | null>({
  key: 'Post/All/Default',
  get: async () => {
    const [posts, error] = await getPosts();

    if (error) throw error;

    return posts;
  },
});

export const postsState = atom<Array<Post> | null>({
  key: 'Post/All',
  default: postsQuery,
});
