import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockMongoComment } from '@test/server/comment/mocks/mockMongoComment';

export const mockMongoComments: Array<CommentDocument> = [
  <CommentDocument>{
    ...mockMongoComment,
    text: 'comment 1',
  },
  <CommentDocument>{
    ...mockMongoComment,
    id: '2',
    _id: '2',
    text: 'comment 2',
    author: <User>{
      ...mockMongoComment.author,
      id: '2',
      _id: '2',
    },
  },
];
