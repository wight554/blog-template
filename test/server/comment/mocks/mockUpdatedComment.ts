import { CommentDocument } from '#server/comment/schemas/CommentSchema.js';
import { mockComment } from '#test/server/comment/mocks/mockComment.js';

export const mockUpdatedComment = <CommentDocument>{
  ...mockComment,
  text: 'comment_upd',
};
