import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockUpdatedMongoUser } from '@test/server/user/mocks/mockUpdatedMongoUser';

export const mockUserModel = {
  create: vi.fn().mockResolvedValue(mockMongoUser),
  findOneAndUpdate: vi.fn().mockResolvedValue(mockUpdatedMongoUser),
  findOne: vi.fn().mockResolvedValue(mockMongoUser),
  findById: vi.fn().mockResolvedValue(mockMongoUser),
};
