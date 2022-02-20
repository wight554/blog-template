import { UserDocument } from '@server/user/schemas/UserSchema';
import { mockUser } from '@test/server/user/mocks/mockUser';

export const mockUpdatedUser = <UserDocument>{
  ...mockUser,
  username: 'username_upd',
  firstName: 'firstName_upd',
  lastName: 'lastName_upd',
};
