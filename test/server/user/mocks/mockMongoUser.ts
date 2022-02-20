import { UserDocument } from '@server/user/schemas/UserSchema';
import { mockUser } from '@test/server/user/mocks/mockUser';

export const mockMongoUser = <UserDocument>{
  ...mockUser,
  _id: '1',
  password: 'password',
  __v: 0,
};
