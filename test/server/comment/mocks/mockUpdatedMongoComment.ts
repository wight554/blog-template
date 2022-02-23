import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { mockMongoComment } from '@test/server/comment/mocks/mockMongoComment';

export const mockUpdatedMongoComment = <CommentDocument>{
  ...mockMongoComment,
  text: 'comment_upd',
};
