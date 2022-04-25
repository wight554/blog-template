import { Types } from 'mongoose';

import { CommentDocument } from '@server/comment/schemas/CommentSchema.js';
import { User } from '@server/user/schemas/UserSchema.js';
import { mockComment } from '@test/server/comment/mocks/mockComment.js';
import { mockMongoUser } from '@test/server/user/mocks/index.js';

export const mockMongoComment = <CommentDocument>{
  ...mockComment,
  _id: new Types.ObjectId(1),
  author: <User>{
    ...mockMongoUser,
  },
  __v: 0,
};
