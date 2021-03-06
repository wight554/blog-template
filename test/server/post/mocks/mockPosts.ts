import { PostDocument } from '#server/post/schemas/PostSchema.js';
import { mockPost } from '#test/server/post/mocks/mockPost.js';

export const mockPosts: Array<PostDocument> = [
  <PostDocument>{
    ...mockPost,
    title: 'title 1',
    description: 'description 1',
  },
  <PostDocument>{
    ...mockPost,
    id: '2',
    title: 'title 2',
    description: 'description 2',
    author: {
      ...mockPost.author,
      id: '2',
    },
  },
];
