import { Comment } from '#server/comment/schemas/CommentSchema.js';
import { PostDocument } from '#server/post/schemas/PostSchema.js';
import { User } from '#server/user/schemas/UserSchema.js';
import { mockComments } from '#test/server/comment/mocks/index.js';
import { mockUser } from '#test/server/user/mocks/index.js';

export const mockPost = <PostDocument>{
  id: '1',
  title: 'title',
  description: 'description',
  author: <User>{
    ...mockUser,
  },
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  comments: <Array<Comment>>[...mockComments],
};
