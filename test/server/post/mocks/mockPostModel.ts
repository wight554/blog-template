import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost.js';
import { mockMongoPosts } from '@test/server/post/mocks/mockMongoPosts.js';
import { mockPostDeleteResult } from '@test/server/post/mocks/mockPostDeleteResult.js';
import { mockPostUpdateResult } from '@test/server/post/mocks/mockPostUpdateResult.js';
import { mockUpdatedMongoPost } from '@test/server/post/mocks/mockUpdatedMongoPost.js';

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
