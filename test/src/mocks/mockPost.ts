import { Post } from '#src/interfaces/model/Post.js';
import { mockUser } from '#test/src/mocks/mockUser.js';

export const mockPost: Post = {
  title: 'post title',
  description: 'post description',
  author: mockUser,
  id: '1',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};
