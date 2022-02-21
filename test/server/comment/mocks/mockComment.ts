import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockUser } from '@test/server/user/mocks/mockUser';

export const mockComment = <CommentDocument>{
  id: '1',
  text: 'comment',
  author: <User>{
    ...mockUser,
  },
  postId: '1',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};
