import { mockCommentDeleteManyResult } from '@test/server/comment/mocks/mockCommentDeleteManyResult';
import { mockCommentDeleteResult } from '@test/server/comment/mocks/mockCommentDeleteResult';
import { mockMongoComment } from '@test/server/comment/mocks/mockMongoComment';
import { mockUpdatedMongoComment } from '@test/server/comment/mocks/mockUpdatedMongoComment';

export const mockCommentModel = {
  findById: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockMongoComment),
  })),
  findByIdAndUpdate: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockUpdatedMongoComment),
  })),
  create: vi.fn().mockImplementation(() => ({
    ...mockMongoComment,
    populate: vi.fn().mockResolvedValue(mockMongoComment),
  })),
  deleteOne: vi.fn().mockResolvedValue(mockCommentDeleteResult),
  deleteMany: vi.fn().mockResolvedValue(mockCommentDeleteManyResult),
};
