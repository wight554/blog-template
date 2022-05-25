import { mockMongoComments } from '#test/server/comment/mocks/mockMongoComments.js';

export const mockCommentDeleteManyResult = {
  deletedCount: mockMongoComments.length,
  acknowledged: true,
};
