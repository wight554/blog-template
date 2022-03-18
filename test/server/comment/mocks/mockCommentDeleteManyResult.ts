import { mockMongoComments } from '@test/server/comment/mocks/mockMongoComments';

export const mockCommentDeleteManyResult = {
  deletedCount: mockMongoComments.length,
  acknowledged: true,
};
