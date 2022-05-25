import { Types } from 'mongoose';

import { CommentDocument } from '#server/comment/schemas/CommentSchema.js';
import { User } from '#server/user/schemas/UserSchema.js';
import { mockMongoComment } from '#test/server/comment/mocks/mockMongoComment.js';

export const mockMongoComments: Array<CommentDocument> = [
  <CommentDocument>{
    ...mockMongoComment,
    text: 'comment 1',
  },
  <CommentDocument>{
    ...mockMongoComment,
    id: '2',
    _id: new Types.ObjectId(2),
    text: 'comment 2',
    author: <User>{
      ...mockMongoComment.author,
      id: '2',
      _id: new Types.ObjectId(2),
    },
  },
];
