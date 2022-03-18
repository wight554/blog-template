import { PostDocument } from '@server/post/schemas/PostSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockComments } from '@test/server/comment/mocks/mockComments';
import { mockUser } from '@test/server/user/mocks/mockUser';
import { Comment } from '@server/comment/schemas/CommentSchema';

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
