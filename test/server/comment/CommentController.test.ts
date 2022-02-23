import { Test, TestingModule } from '@nestjs/testing';

import { CommentController } from '@server/comment/CommentController';
import { CommentService } from '@server/comment/CommentService';
import { mockUser } from '@test/server/user/mocks/mockUser';
import { mockUpsertComment } from '@test/server/comment/mocks/mockUpsertComment';

const userId = '1';
const postId = '1';
const commentId = '1';

describe('CommentController', () => {
  let commentService: CommentService;
  let commentController: CommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      await commentController.createComment(postId, mockUpsertComment, mockUser);

      expect(commentService.create).toHaveBeenCalledWith(mockUpsertComment, postId, userId);
    });

    describe('comment service success', () => {
      it('should return undefined', async () => {
        expect(await commentController.createComment(postId, mockUpsertComment, mockUser)).toBe(
          undefined,
        );
      });
    });

    describe('comment service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(commentService, 'create').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await commentController.createComment(postId, mockUpsertComment, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('updateComment', () => {
    it('should update comment', async () => {
      await commentController.updateComment(commentId, mockUpsertComment, mockUser);

      expect(commentService.update).toBeCalledWith(commentId, mockUpsertComment, userId);
    });

    describe('comment service success', () => {
      it('should return undefined', async () => {
        expect(await commentController.updateComment(commentId, mockUpsertComment, mockUser)).toBe(
          undefined,
        );
      });
    });

    describe('comment service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(commentService, 'update').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await commentController.updateComment(commentId, mockUpsertComment, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete comment', async () => {
      await commentController.deleteComment(commentId, mockUser);

      expect(commentService.delete).toBeCalledWith(commentId, userId);
    });

    describe('comment service success', () => {
      it('should return undefined', async () => {
        expect(await commentController.deleteComment(commentId, mockUser)).toBe(undefined);
      });
    });

    describe('comment service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(commentService, 'delete').mockRejectedValueOnce(error);
        expect.assertions(1);

        try {
          await commentController.deleteComment(commentId, mockUser);
        } catch (e) {
          expect(e).toBe(error);
        }
      });
    });
  });
});
