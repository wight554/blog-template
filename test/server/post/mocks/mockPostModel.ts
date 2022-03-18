import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost';
import { mockMongoPosts } from '@test/server/post/mocks/mockMongoPosts';
import { mockPostDeleteResult } from '@test/server/post/mocks/mockPostDeleteResult';
import { mockUpdatedMongoPost } from '@test/server/post/mocks/mockUpdatedMongoPost';
import { mockPostUpdateResult } from '@test/server/post/mocks/mockPostUpdateResult';

export const mockPostModel = {
  find: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockResolvedValue(mockMongoPosts),
    })),
  })),
  findById: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockMongoPost),
  })),
  create: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockMongoPost),
  })),
  findByIdAndUpdate: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockUpdatedMongoPost),
  })),
  deleteOne: vi.fn().mockResolvedValue(mockPostDeleteResult),
  updateOne: vi.fn().mockResolvedValue(mockPostUpdateResult),
};
