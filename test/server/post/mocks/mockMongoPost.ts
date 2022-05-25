import { Types } from 'mongoose';

import { Comment } from '#server/comment/schemas/CommentSchema.js';
import { PostDocument } from '#server/post/schemas/PostSchema.js';
import { User } from '#server/user/schemas/UserSchema.js';
import { mockMongoComments } from '#test/server/comment/mocks/index.js';
import { mockPost } from '#test/server/post/mocks/mockPost.js';
import { mockMongoUser } from '#test/server/user/mocks/index.js';

export const mockMongoPost = <PostDocument>{
  ...mockPost,
  _id: new Types.ObjectId(1),
  author: <User>{
    ...mockMongoUser,
  },
  comments: <Array<Comment>>[...mockMongoComments],
  __v: 0,
};
