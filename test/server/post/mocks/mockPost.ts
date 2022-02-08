import { PostDocument } from '@server/post/schemas/PostSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockUser } from '@test/server/user/mocks/mockUser';

export const mockPost = <PostDocument>{
  id: '1',
  title: 'title',
  description: 'description',
  author: <User>{
    ...mockUser,
  },
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};
