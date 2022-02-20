import { PostDocument } from '@server/post/schemas/PostSchema';
import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost';

export const mockUpdatedMongoPost = <PostDocument>{
  ...mockMongoPost,
  title: 'title_upd',
  description: 'description_upd',
};
