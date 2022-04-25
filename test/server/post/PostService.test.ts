import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Connection as MongooseConnection } from 'mongoose';

import { Comment, CommentDocument } from '@server/comment/schemas/CommentSchema.js';
import { PostService } from '@server/post/PostService.js';
import { Post, PostDocument } from '@server/post/schemas/PostSchema.js';
import { mockCommentModel } from '@test/server/comment/mocks/index.js';
import { mockMongoConnection } from '@test/server/mocks/index.js';
import {
  mockPostModel,
  mockMongoPosts,
  mockMongoPost,
  mockUpsertPost,
  mockUpdatedMongoPost,
} from '@test/server/post/mocks/index.js';

const postId = '1';
const userId = '1';

describe('PostService', () => {
  let commentModel: Model<CommentDocument>;
  let postModel: Model<PostDocument>;
  let connection: MongooseConnection;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
        {
          provide: getModelToken(Comment.name),
          useValue: mockCommentModel,
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
    postService = module.get<PostService>(PostService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should get all posts using post model', async () => {
      await postService.getAll();

      expect(postModel.find).toHaveBeenCalled();
    });

    it('should return all posts', async () => {
      expect(await postService.getAll()).toEqual(mockMongoPosts);
    });
  });

  describe('getById', () => {
    it('should get post by id using post model', async () => {
      await postService.getById(postId);

      expect(postModel.findById).toHaveBeenCalledWith(postId);
    });

    describe('post exists', () => {
      it('should return post', async () => {
        expect(await postService.getById(postId)).toEqual(mockMongoPost);
      });
    });

    describe('post does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(postModel, 'findById').mockResolvedValueOnce(null);

        await expect(postService.getById(postId)).rejects.toThrowError(NotFoundException);
      });
    });
  });

  describe('create', () => {
    it('should create post using post model', async () => {
      await postService.create(mockUpsertPost, userId);

      expect(postModel.create).toHaveBeenCalledWith({ ...mockUpsertPost, author: userId });
    });

    describe('post model success', () => {
      it('should return created post', async () => {
        expect(await postService.create(mockUpsertPost, userId)).toEqual(mockMongoPost);
      });
    });
  });

  describe('update', () => {
    it('should get post by id', async () => {
      vi.spyOn(postService, 'getById').mockResolvedValueOnce(mockMongoPost);

      await postService.update(postId, mockUpsertPost, userId);

      expect(postService.getById).toHaveBeenCalledWith(postId);
    });

    it('should throw forbidden exception if author id does not match user id', async () => {
      vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{ author: { id: '2' } });

      await expect(postService.update(postId, mockUpsertPost, userId)).rejects.toThrowError(
        ForbiddenException,
      );
    });

    it('should update post using post model', async () => {
      await postService.update(postId, mockUpsertPost, userId);

      expect(postModel.findByIdAndUpdate).toHaveBeenCalledWith(postId, mockUpsertPost, {
        new: true,
      });
    });

    describe('post exists', () => {
      it('should return updated post', async () => {
        expect(await postService.update(postId, mockUpsertPost, userId)).toEqual(
          mockUpdatedMongoPost,
        );
      });
    });

    describe('post does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(postModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

        await expect(postService.update(postId, mockUpsertPost, userId)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });
  });

  describe('delete', () => {
    it('should start session', async () => {
      vi.spyOn(connection, 'startSession');

      await postService.delete(postId, userId);

      expect(connection.startSession).toHaveBeenCalledOnce();
    });

    it('should get post by id', async () => {
      vi.spyOn(postService, 'getById');

      await postService.delete(postId, userId);

      expect(postService.getById).toHaveBeenCalledWith(postId);
    });

    describe('author id does not match user id', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{
          author: { id: '2' },
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await postService.delete(postId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw forbidden exception', async () => {
        vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{
          author: { id: '2' },
        });

        await expect(postService.delete(postId, userId)).rejects.toThrowError(ForbiddenException);
      });
    });

    it('should delete post using post model', async () => {
      await postService.delete(postId, userId);

      expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: postId });
    });

    it('should delete post comments using comment model', async () => {
      await postService.delete(postId, userId);

      expect(commentModel.deleteMany).toHaveBeenCalledWith({
        _id: {
          $in: mockMongoPost.comments.map(({ id }) => id),
        },
      });
    });

    it('should commit transaction', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await postService.delete(postId, userId);

      expect(session.commitTransaction).toHaveBeenCalledOnce();
    });

    describe('deleted posts count is 0', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(postModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await postService.delete(postId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });

        await expect(postService.delete(postId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    describe('deleted comments count is lower that post comments count', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(commentModel, 'deleteMany').mockResolvedValueOnce({
          deletedCount: mockMongoPost.comments.length - 1,
          acknowledged: true,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

        try {
          await postService.delete(postId, userId);
        } catch {}

        expect(session.abortTransaction).toHaveBeenCalledOnce();
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'deleteMany').mockResolvedValueOnce({
          deletedCount: mockMongoPost.comments.length - 1,
          acknowledged: true,
        });

        await expect(postService.delete(postId, userId)).rejects.toThrowError(
          InternalServerErrorException,
        );
      });
    });

    it('should return undefined if post was successfully deleted', async () => {
      expect(await postService.delete(postId, userId)).toEqual(undefined);
    });

    it('should end session', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(async () => session);

      await postService.delete(postId, userId);

      expect(session.endSession).toHaveBeenCalledOnce();
    });
  });
});
