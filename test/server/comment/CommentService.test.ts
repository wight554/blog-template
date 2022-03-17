import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Model, Connection as MongooseConnection } from 'mongoose';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CommentService } from '@server/comment/CommentService';
import { Comment, CommentDocument } from '@server/comment/schemas/CommentSchema';
import { mockMongoComment } from '@test/server/comment/mocks/mockMongoComment';
import { mockPostModel } from '@test/server/post/mocks/mockPostModel';
import { mockUpsertComment } from '@test/server/comment/mocks/mockUpsertComment';

import { Post, PostDocument } from '@server/post/schemas/PostSchema';
import { mockCommentModel } from '@test/server/comment/mocks/mockCommentModel';
import { mockMongoConnection } from '@test/server/mocks/mockMongoConnection';
import { mockPostUpdateResult } from '../post/mocks/mockPostUpdateResult';
import { mockUpdatedMongoComment } from './mocks/mockUpdatedMongoComment';

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

        try {
          await commentService.getById(commentId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('create', () => {
    it('should start session', async () => {
      vi.spyOn(connection, 'startSession');

      await commentService.delete(commentId, userId);

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
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'create').mockResolvedValueOnce();

        try {
          expect(await commentService.create(mockUpsertComment, postId, userId));
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
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
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });

        try {
          await commentService.create(mockUpsertComment, postId, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });

    describe('comment model success', () => {
      it('should return created comment', async () => {
        expect(await commentService.create(mockUpsertComment, postId, userId)).toBe(
          mockMongoComment,
        );
      });
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

      try {
        await commentService.update(commentId, mockUpsertComment, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
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

        try {
          await commentService.update(commentId, mockUpsertComment, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
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
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw forbidden exception', async () => {
        vi.spyOn(commentService, 'getById').mockResolvedValueOnce(<CommentDocument>{
          author: { id: '2' },
        });

        try {
          await commentService.delete(commentId, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
        }
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
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });

        try {
          expect(await commentService.delete(commentId, userId)).toEqual(undefined);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
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
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'updateOne').mockResolvedValueOnce({
          ...mockPostUpdateResult,
          modifiedCount: 0,
        });

        try {
          expect(await commentService.delete(commentId, userId)).toEqual(undefined);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
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
