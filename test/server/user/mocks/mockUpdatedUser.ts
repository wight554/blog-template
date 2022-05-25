import { UserDocument } from '#server/user/schemas/UserSchema.js';
import { mockUser } from '#test/server/user/mocks/mockUser.js';

export const mockUpdatedUser = <UserDocument>{
  ...mockUser,
  username: 'username_upd',
  firstName: 'firstName_upd',
  lastName: 'lastName_upd',
};
