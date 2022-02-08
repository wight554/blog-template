import sinon from 'sinon';

import { PostController } from '@server/post/PostController';
import { PostService } from '@server/post/PostService';
import { PostDocument } from '@server/post/schemas/PostSchema';
import { UserDocument } from '@server/user/schemas/UserSchema';

const mockPostService = sinon.createStubInstance(PostService);

const mockPostId = '1';

const mockPosts: Array<PostDocument> = [
  <PostDocument>{
    id: '1',
    title: 'title 1',
    description: 'description 1',
    author: {
      username: 'username 1',
      id: '1',
    },
  },
  <PostDocument>{
    id: '2',
    title: 'title 2',
    description: 'description 2',
    author: {
      username: 'username 2',
      id: '2',
    },
  },
];

const mockUpsertPost = {
  title: 'title 1',
  description: 'description 1',
};

const mockUser = <UserDocument>{
  id: '1',
  username: 'username',
};

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

  describe('getPost', () => {
    it('should get post by id', async () => {
      await postController.getPost(mockPostId);

      sinon.assert.calledWith(mockPostService.getById, mockPostId);
    });

    describe('post service success', () => {
      it('should return posts', async () => {
        mockPostService.getById.resolves(mockPosts[0]);

        expect(await postController.getPost(mockPostId)).toBe(mockPosts[0]);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockPostService.getById.rejects(error);
        expect.assertions(1);

        await expect(postController.getPost(mockPostId)).rejects.toEqual(error);
      });
    });
  });

  describe('createPost', () => {
    it('should create post', async () => {
      await postController.createPost(mockUpsertPost, mockUser);

      sinon.assert.calledWith(mockPostService.create, mockUpsertPost, mockUser.id);
    });

    describe('post service success', () => {
      it('should return created post', async () => {
        mockPostService.create.resolves(mockPosts[0]);

        expect(await postController.createPost(mockUpsertPost, mockUser)).toBe(mockPosts[0]);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockPostService.create.rejects(error);
        expect.assertions(1);

        await expect(postController.createPost(mockUpsertPost, mockUser)).rejects.toEqual(error);
      });
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      await postController.updatePost(mockPostId, mockUpsertPost, mockUser);

      sinon.assert.calledWith(mockPostService.update, mockPostId, mockUpsertPost, mockUser.id);
    });

    describe('post service success', () => {
      it('should return updated post', async () => {
        mockPostService.update.resolves(mockPosts[0]);

        expect(await postController.updatePost(mockPostId, mockUpsertPost, mockUser)).toBe(
          mockPosts[0],
        );
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockPostService.update.rejects(error);
        expect.assertions(1);

        await expect(
          postController.updatePost(mockPostId, mockUpsertPost, mockUser),
        ).rejects.toEqual(error);
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      await postController.deletePost(mockPostId, mockUser);

      sinon.assert.calledWith(mockPostService.delete, mockPostId, mockUser.id);
    });

    describe('post service success', () => {
      it('should return undefined', async () => {
        const result = await postController.deletePost(mockPostId, mockUser);

        console.error(typeof result);

        expect(await postController.deletePost(mockPostId, mockUser)).toBe(undefined);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        mockPostService.delete.rejects(error);
        expect.assertions(1);

        await expect(postController.deletePost(mockPostId, mockUser)).rejects.toEqual(error);
      });
    });
  });
});
