import { CommentDocument } from '@server/comment/schemas/CommentSchema';
import { mockComment } from '@test/server/comment/mocks/mockComment';

export const mockComments: Array<CommentDocument> = [
  <CommentDocument>{
    ...mockComment,
    text: 'comment 1',
  },
  <CommentDocument>{
    ...mockComment,
    id: '2',
    text: 'comment 2',
    author: {
      ...mockComment.author,
      id: '2',
    },
  },
];
