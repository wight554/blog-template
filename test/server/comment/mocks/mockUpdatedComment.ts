import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { mockComment } from '@test/server/comment/mocks/mockComment';

export const mockUpdatedComment = <CommentDocument>{
  ...mockComment,
  text: 'comment_upd',
};
