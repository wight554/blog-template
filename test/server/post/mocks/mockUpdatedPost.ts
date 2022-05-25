import { PostDocument } from '#server/post/schemas/PostSchema.js';
import { mockPost } from '#test/server/post/mocks/mockPost.js';

export const mockUpdatedPost = <PostDocument>{
  ...mockPost,
  title: 'title_upd',
  description: 'description_upd',
};
