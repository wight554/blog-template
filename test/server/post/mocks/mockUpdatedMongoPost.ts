import { PostDocument } from '@server/post/schemas/PostSchema.js';
import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost.js';

export const mockUpdatedMongoPost = <PostDocument>{
  ...mockMongoPost,
  title: 'title_upd',
  description: 'description_upd',
};
