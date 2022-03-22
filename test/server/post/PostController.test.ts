import { Test, TestingModule } from '@nestjs/testing';

import { PostController } from '@server/post/PostController';
import { PostService } from '@server/post/PostService';
import { CommentService } from '@server/comment/CommentService';
import { mockUser } from '@test/server/user/mocks';
import { mockComment, mockUpsertComment } from '@test/server/comment/mocks';
import { mockPosts, mockPost, mockUpdatedPost, mockUpsertPost } from '@test/server/post/mocks';

const userId = '1';
const postId = '1';

describe('PostController', () => {
  let commentService: CommentService;
  let postService: PostService;
  let postController: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getAll: vi.fn().mockResolvedValue(mockPosts),
            getById: vi.fn().mockResolvedValue(mockPost),
            create: vi.fn().mockResolvedValue(mockPost),
            update: vi.fn().mockResolvedValue(mockUpdatedPost),
            delete: vi.fn(),
          },
        },
        {
          provide: CommentService,
          useValue: {
            create: vi.fn().mockResolvedValue(mockComment),
          },
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
    commentService = module.get<CommentService>(CommentService);
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
        vi.spyOn(postService, 'getAll').mockRejectedValueOnce(error);
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
        vi.spyOn(postService, 'getById').mockRejectedValueOnce(error);
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
        vi.spyOn(postService, 'create').mockRejectedValueOnce(error);
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
        vi.spyOn(postService, 'update').mockRejectedValueOnce(error);
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
        vi.spyOn(postService, 'delete').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await postController.deletePost(postId, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('createPostComment', () => {
    it('should create comment', async () => {
      await postController.createPostComment(postId, mockUpsertComment, mockUser);

      expect(commentService.create).toHaveBeenCalledWith(mockUpsertComment, postId, userId);
    });

    describe('comment service success', () => {
      it('should return created comment', async () => {
        expect(await postController.createPostComment(postId, mockUpsertComment, mockUser)).toBe(
          mockComment,
        );
      });
    });

    describe('comment service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(commentService, 'create').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await postController.createPostComment(postId, mockUpsertComment, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
