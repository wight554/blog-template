import { Test, TestingModule } from '@nestjs/testing';

import { CommentController } from '@server/comment/CommentController';
import { CommentService } from '@server/comment/CommentService';
import { mockComment, mockUpdatedComment, mockUpsertComment } from '@test/server/comment/mocks';
import { mockUser } from '@test/server/user/mocks';

const userId = '1';
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
            create: vi.fn().mockResolvedValue(mockComment),
            update: vi.fn().mockResolvedValue(mockUpdatedComment),
            delete: vi.fn(),
          },
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  describe('updateComment', () => {
    it('should update comment', async () => {
      await commentController.updateComment(commentId, mockUpsertComment, mockUser);

      expect(commentService.update).toBeCalledWith(commentId, mockUpsertComment, userId);
    });

    describe('comment service success', () => {
      it('should return updated comment', async () => {
        expect(await commentController.updateComment(commentId, mockUpsertComment, mockUser)).toBe(
          mockUpdatedComment,
        );
      });
    });

    describe('comment service error', () => {
      it('should throw error', async () => {
        const error = new Error('Internal Error');
        vi.spyOn(commentService, 'update').mockRejectedValueOnce(error);
        expect.assertions(1);

        await expect(
          commentController.updateComment(commentId, mockUpsertComment, mockUser),
        ).rejects.toThrowError(error);
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

        await expect(commentController.deleteComment(commentId, mockUser)).rejects.toThrowError(
          error,
        );
      });
    });
  });
});
