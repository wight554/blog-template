import { CommentDocument } from '#server/comment/schemas/CommentSchema.js';
import { mockMongoComment } from '#test/server/comment/mocks/mockMongoComment.js';

export const mockUpdatedMongoComment = <CommentDocument>{
  ...mockMongoComment,
  text: 'comment_upd',
};
