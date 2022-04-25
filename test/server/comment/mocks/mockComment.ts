import { CommentDocument } from '@server/comment/schemas/CommentSchema.js';
import { User } from '@server/user/schemas/UserSchema.js';
import { mockUser } from '@test/server/user/mocks/mockUser.js';

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
