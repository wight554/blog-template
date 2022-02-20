import { PostDocument } from '@server/post/schemas/PostSchema';
import { mockPost } from '@test/server/post/mocks/mockPost';

export const mockUpdatedPost = <PostDocument>{
  ...mockPost,
  title: 'title_upd',
  description: 'description_upd',
};
