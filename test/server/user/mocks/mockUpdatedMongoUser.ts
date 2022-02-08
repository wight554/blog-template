import { UserDocument } from '@server/user/schemas/UserSchema';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';

export const mockUpdatedMongoUser = <UserDocument>{
  ...mockMongoUser,
  username: 'username_upd',
  firstName: 'firstName_upd',
  lastName: 'lastName_upd',
};
