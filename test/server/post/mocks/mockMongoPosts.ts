import { PostDocument } from '@server/post/schemas/PostSchema';
import { User } from '@server/user/schemas/UserSchema';
import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost';

export const mockMongoPosts: Array<PostDocument> = [
  <PostDocument>{
    ...mockMongoPost,
    description: 'description 1',
    title: 'title 1',
  },
  <PostDocument>{
    ...mockMongoPost,
    id: '2',
    _id: '2',
    author: <User>{
      ...mockMongoPost.author,
      id: '2',
      _id: '2',
    },
    description: 'description 2',
    title: 'title 2',
  },
];
