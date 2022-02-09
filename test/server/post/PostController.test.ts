import { mock, instance, when, reset } from 'ts-mockito';

import { PostController } from '@server/post/PostController';
import { PostService } from '@server/post/PostService';
import { mockUser } from '@test/server/user/mocks/mockUser';
import { mockPosts } from '@test/server/post/mocks/mockPosts';
import { mockUpsertPost } from '@test/server/post/mocks/mockUpsertPost';
import { mockPost } from '@test/server/post/mocks/mockPost';
import { mockUpdatedPost } from '@test/server/post/mocks/mockUpdatedPost';

const mockPostService = mock<PostService>();

const userId = '1';
const postId = '1';

describe('PostController', () => {
  let postService: PostService;
  let postController: PostController;

  beforeEach(() => {
    when(mockPostService.getAll).thenReturn(vi.fn().mockResolvedValue(mockPosts));
    when(mockPostService.getById).thenReturn(vi.fn().mockResolvedValue(mockPost));
    when(mockPostService.create).thenReturn(vi.fn().mockResolvedValue(mockPost));
    when(mockPostService.update).thenReturn(vi.fn().mockResolvedValue(mockUpdatedPost));
    when(mockPostService.delete).thenReturn(vi.fn());

    postService = instance(mockPostService);
    postController = new PostController(postService);
  });

  afterEach(() => {
    reset(mockPostService);
  });

  describe('getPosts', () => {
    it('should get all posts', async () => {
      await postController.getPosts();

      expect(postService.getAll).toBeCalled();
    });

    describe('post service success', () => {
      it('should return posts', async () => {
        expect(await postController.getPosts()).toBe(mockPosts);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        when(mockPostService.getAll).thenThrow(error);
        expect.assertions(1);

        try {
          await postController.getPosts();
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('getPost', () => {
    it('should get post by id', async () => {
      await postController.getPost(postId);

      expect(postService.getById).toBeCalledWith(postId);
    });

    describe('post service success', () => {
      it('should return posts', async () => {
        expect(await postController.getPost(postId)).toBe(mockPost);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        when(mockPostService.getById).thenThrow(error);
        expect.assertions(1);

        try {
          await postController.getPost(postId);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('createPost', () => {
    it('should create post', async () => {
      await postController.createPost(mockUpsertPost, mockUser);

      expect(postService.create).toHaveBeenCalledWith(mockUpsertPost, userId);
    });

    describe('post service success', () => {
      it('should return created post', async () => {
        expect(await postController.createPost(mockUpsertPost, mockUser)).toBe(mockPost);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        when(mockPostService.create).thenThrow(error);
        expect.assertions(1);

        try {
          await postController.createPost(mockUpsertPost, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      await postController.updatePost(postId, mockUpsertPost, mockUser);

      expect(postService.update).toBeCalledWith(postId, mockUpsertPost, userId);
    });

    describe('post service success', () => {
      it('should return updated post', async () => {
        expect(await postController.updatePost(postId, mockUpsertPost, mockUser)).toBe(
          mockUpdatedPost,
        );
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        when(mockPostService.update).thenThrow(error);
        expect.assertions(1);

        try {
          await postController.updatePost(postId, mockUpsertPost, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      await postController.deletePost(postId, mockUser);

      expect(postService.delete).toBeCalledWith(postId, userId);
    });

    describe('post service success', () => {
      it('should return undefined', async () => {
        expect(await postController.deletePost(postId, mockUser)).toBe(undefined);
      });
    });

    describe('post service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        when(mockPostService.delete).thenThrow(error);
        expect.assertions(1);

        try {
          await postController.deletePost(postId, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
