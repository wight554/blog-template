import { Types } from 'mongoose';

import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockComment } from '@test/server/comment/mocks/mockComment';
import { mockMongoUser } from '@test/server/user/mocks';

export const mockMongoComment = <CommentDocument>{
  ...mockComment,
  _id: new Types.ObjectId(1),
  author: <User>{
    ...mockMongoUser,
  },
  __v: 0,
};
