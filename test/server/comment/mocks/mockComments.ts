import { CommentDocument } from '#server/comment/schemas/CommentSchema.js';
import { mockComment } from '#test/server/comment/mocks/mockComment.js';

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
