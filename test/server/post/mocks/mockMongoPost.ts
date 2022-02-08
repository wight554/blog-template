import { PostDocument } from '@server/post/schemas/PostSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockMongoUser } from '@test/server/user/mocks/mockMongoUser';
import { mockPost } from '@test/server/post/mocks/mockPost';

export const mockMongoPost = <PostDocument>{
  ...mockPost,
  _id: '1',
  author: <User>{
    ...mockMongoUser,
  },
  __v: 0,
};
