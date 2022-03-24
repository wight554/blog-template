import { Types } from 'mongoose';

import { Comment } from '@server/comment/schemas/CommentSchema';
import { PostDocument } from '@server/post/schemas/PostSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockMongoComments } from '@test/server/comment/mocks';
import { mockPost } from '@test/server/post/mocks/mockPost';
import { mockMongoUser } from '@test/server/user/mocks';

export const mockMongoPost = <PostDocument>{
  ...mockPost,
  _id: new Types.ObjectId(1),
  author: <User>{
    ...mockMongoUser,
  },
  comments: <Array<Comment>>[...mockMongoComments],
  __v: 0,
};
