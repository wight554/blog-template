import sinon from 'sinon';

import { PostController } from '@server/post/PostController';
import { PostService } from '@server/post/PostService';
import { PostDocument } from '@server/post/schemas/PostSchema';

const mockPostService = sinon.createStubInstance(PostService);

const mockPosts: Array<PostDocument> = [
  <PostDocument>{
    id: '1',
    title: 'title 1',
    name: 'name 1',
    date: 'new date',
    author: {
      username: 'username 1',
      id: '1',
    },
  },
  <PostDocument>{
    id: '2',
    title: 'title 2',
    name: 'name 2',
    date: 'new date',
    author: {
      username: 'username 2',
      id: '2',
    },
  },
];

describe('PostController', () => {
  let postController: PostController;

  beforeEach(() => {
    postController = new PostController(mockPostService);
  });

  afterEach(() => {
    sinon.reset();
  });

  describe('getPosts', () => {
    it('should get all posts', async () => {
      await postController.getPosts();

      sinon.assert.calledOnce(mockPostService.getAll);
    });

    describe('post service success', () => {
      it('should return posts', async () => {
        mockPostService.getAll.resolves(mockPosts);

        expect(await postController.getPosts()).toBe(mockPosts);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockPostService.getAll.rejects(error);
        expect.assertions(1);

        await expect(postController.getPosts()).rejects.toEqual(error);
      });
    });
  });
});
