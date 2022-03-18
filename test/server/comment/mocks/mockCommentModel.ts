import { mockMongoComment } from '@test/server/comment/mocks/mockMongoComment';
import { mockCommentDeleteResult } from '@test/server/comment/mocks/mockCommentDeleteResult';
import { mockCommentDeleteManyResult } from '@test/server/comment/mocks/mockCommentDeleteManyResult';
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
