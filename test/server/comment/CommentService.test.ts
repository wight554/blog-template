import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection as MongooseConnection, Model } from 'mongoose';

import { CommentService } from '#server/comment/CommentService.js';
import { Comment, CommentDocument } from '#server/comment/schemas/CommentSchema.js';
import { Post, PostDocument } from '#server/post/schemas/PostSchema.js';
import {
  mockCommentModel,
  mockMongoComment,
  mockUpdatedMongoComment,
  mockUpsertComment,
} from '#test/server/comment/mocks/index.js';
import { mockMongoConnection } from '#test/server/mocks/index.js';
import { mockPostModel, mockPostUpdateResult } from '#test/server/post/mocks/index.js';

const commentId = '1';
const postId = '1';
const userId = '1';

describe('CommentService', () => {
  let commentModel: Model<CommentDocument>;
  let postModel: Model<PostDocument>;
  let connection: MongooseConnection;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment.name),
          useValue: mockCommentModel,
        },
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
        {
          provide: getConnectionToken(),
          useValue: mockMongoConnection,
        },
      ],
    }).compile();

    commentModel = module.get<Model<CommentDocument>>(getModelToken(Comment.name));
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
    connection = module.get<MongooseConnection>(getConnectionToken());
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getById', () => {
    it('should get comment by id using comment model', async () => {
      await commentService.getById(commentId);

      expect(commentModel.findById).toHaveBeenCalledWith(commentId);
    });

    describe('comment exists', () => {
      it('should return comment', async () => {
        expect(await commentService.getById(commentId)).toEqual(mockMongoComment);
      });
    });

    describe('comment does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(commentModel, 'findById').mockResolvedValueOnce(null);

        await expect(commentService.getById(commentId)).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('create', () => {
    it('should start session', async () => {
      vi.spyOn(connection, 'startSession');

      await commentService.create(mockUpsertComment, postId, userId);

      expect(connection.startSession).toHaveBeenCalledOnce();
    });

    it('should create comment using comment model', async () => {
      await commentService.create(mockUpsertComment, postId, userId);

      expect(commentModel.create).toHaveBeenCalledWith({
        ...mockUpsertComment,
        author: userId,
        postId,
      });
    });

    it('should add comment to post using post model', async () => {
      await commentService.create(mockUpsertComment, postId, userId);

      expect(postModel.updateOne).toHaveBeenCalledWith(
        { _id: postId },
        {
          $push: { comments: commentId },
        },
        { useFindAndModify: false },
      );
    });

    it('should commit transaction', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await commentService.create(mockUpsertComment, postId, userId);

      expect(session.commitTransaction).toHaveBeenCalledOnce();
    });

    describe('comment was not created', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(commentModel, 'create').mockResolvedValueOnce();
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await commentService.create(mockUpsertComment, postId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'create').mockResolvedValueOnce();

        await expect(commentService.create(mockUpsertComment, postId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    describe('modified posts count is 0', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await commentService.create(mockUpsertComment, postId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });

        await expect(commentService.create(mockUpsertComment, postId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    it('should return created comment if comment was successfully created', async () => {
      expect(await commentService.create(mockUpsertComment, postId, userId)).toEqual(
        mockMongoComment,
      );
    });

    it('should end session', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await commentService.create(mockUpsertComment, postId, userId);

      expect(session.endSession).toHaveBeenCalledOnce();
    });
  });

  describe('update', () => {
    it('should get comment by id', async () => {
      vi.spyOn(commentService, 'getById').mockResolvedValueOnce(mockMongoComment);

      await commentService.update(commentId, mockUpsertComment, userId);

      expect(commentService.getById).toHaveBeenCalledWith(commentId);
    });

    it('should throw forbidden exception if author id does not match user id', async () => {
      vi.spyOn(commentService, 'getById').mockResolvedValueOnce(<CommentDocument>{
        author: { id: '2' },
      });

      await expect(
        commentService.update(commentId, mockUpsertComment, userId),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should update comment using comment model', async () => {
      await commentService.update(commentId, mockUpsertComment, userId);

      expect(commentModel.findByIdAndUpdate).toHaveBeenCalledWith(commentId, mockUpsertComment, {
        new: true,
      });
    });

    describe('comment was updated', () => {
      it('should return updated comment', async () => {
        expect(await commentService.update(commentId, mockUpsertComment, userId)).toBe(
          mockUpdatedMongoComment,
        );
      });
    });

    describe('comment was not updated', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(commentModel, 'findByIdAndUpdate').mockResolvedValueOnce(undefined);

        await expect(
          commentService.update(commentId, mockUpsertComment, userId),
        ).rejects.toThrowError(InternalServerErrorException);
      });
    });
  });

  describe('delete', () => {
    it('should start session', async () => {
      vi.spyOn(connection, 'startSession');

      await commentService.delete(commentId, userId);

      expect(connection.startSession).toHaveBeenCalledOnce();
    });

    it('should get comment by id', async () => {
      vi.spyOn(commentService, 'getById');

      await commentService.delete(commentId, userId);

      expect(commentService.getById).toHaveBeenCalledWith(commentId);
    });

    describe('author id does not match user id', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(commentService, 'getById').mockResolvedValueOnce(<CommentDocument>{
          author: { id: '2' },
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await commentService.delete(commentId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw forbidden exception', async () => {
        vi.spyOn(commentService, 'getById').mockResolvedValueOnce(<CommentDocument>{
          author: { id: '2' },
        });

        await expect(commentService.delete(commentId, userId)).rejects.toThrowError(
          ForbiddenException,
        );
      });
    });

    it('should delete comment using comment model', async () => {
      await commentService.delete(commentId, userId);

      expect(commentModel.deleteOne).toHaveBeenCalledWith({ _id: commentId });
    });

    it('should delete comment from post using post model', async () => {
      await commentService.delete(commentId, userId);

      expect(postModel.updateOne).toHaveBeenCalledWith(
        { _id: postId },
        {
          $pull: { comments: commentId },
        },
        { useFindAndModify: false },
      );
    });

    it('should commit transaction', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await commentService.delete(commentId, userId);

      expect(session.commitTransaction).toHaveBeenCalledOnce();
    });

    describe('deleted comments count is 0', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(commentModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await commentService.delete(commentId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });

        await expect(commentService.delete(commentId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    describe('modified posts count is 0', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await commentService.delete(commentId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });

        await expect(commentService.delete(commentId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    it('should return undefined if comment was successfully deleted', async () => {
      expect(await commentService.delete(commentId, userId)).toEqual(undefined);
    });

    it('should end session', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await commentService.delete(commentId, userId);

      expect(session.endSession).toHaveBeenCalledOnce();
    });
  });
});
