import { UserDocument } from '@server/user/schemas/UserSchema.js';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser.js';

export const mockUpdatedMongoUser = <UserDocument>{
  ...mockMongoUser,
  username: 'username_upd',
  firstName: 'firstName_upd',
  lastName: 'lastName_upd',
};
