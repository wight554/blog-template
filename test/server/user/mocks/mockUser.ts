import { UserDocument } from '@server/user/schemas/UserSchema.js';

export const mockUser = <UserDocument>{
  id: '1',
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
};
