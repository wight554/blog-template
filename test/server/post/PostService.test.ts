import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Model, Connection as MongooseConnection } from 'mongoose';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PostService } from '@server/post/PostService';
import { Post, PostDocument } from '@server/post/schemas/PostSchema';
import { mockMongoPost } from '@test/server/post/mocks/mockMongoPost';
import { mockMongoPosts } from '@test/server/post/mocks/mockMongoPosts';
import { mockPostModel } from '@test/server/post/mocks/mockPostModel';
import { mockUpsertPost } from '@test/server/post/mocks/mockUpsertPost';
import { mockUpdatedMongoPost } from '@test/server/post/mocks/mockUpdatedMongoPost';
import { Comment, CommentDocument } from '@server/comment/schemas/CommentSchema';
import { mockCommentModel } from '@test/server/comment/mocks/mockCommentModel';
import { mockMongoConnection } from '@test/server/mocks/mockMongoConnection';

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

        try {
          await postService.getById(postId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
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

      try {
        await postService.update(postId, mockUpsertPost, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should update post using post model', async () => {
      await postService.update(postId, mockUpsertPost, userId);

      expect(postModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: postId }, mockUpsertPost, {
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
        vi.spyOn(postModel, 'findOneAndUpdate').mockResolvedValueOnce(null);

        try {
          await postService.update(postId, mockUpsertPost, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
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
        vi.spyOn(connection, 'startSession').mockImplementationOnce(() => session);

        try {
          await postService.delete(postId, userId);
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw forbidden exception', async () => {
        vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{
          author: { id: '2' },
        });

        try {
          await postService.delete(postId, userId);
        } catch (error) {
          expect(error).toBeInstanceOf(ForbiddenException);
        }
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
      vi.spyOn(connection, 'startSession').mockImplementationOnce(() => session);

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
        vi.spyOn(connection, 'startSession').mockImplementationOnce(() => session);

        try {
          await postService.delete(postId, userId);
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(postModel, 'deleteOne').mockResolvedValueOnce({
          deletedCount: 0,
          acknowledged: true,
        });

        try {
          expect(await postService.delete(postId, userId)).toEqual(undefined);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });

    describe('deleted comments count is lower that post comments count', () => {
      it('should abort transaction', async () => {
        const session = await connection.startSession();
        vi.spyOn(commentModel, 'deleteMany').mockResolvedValueOnce({
          deletedCount: mockMongoPost.comments.length - 1,
          acknowledged: true,
        });
        vi.spyOn(connection, 'startSession').mockImplementationOnce(() => session);

        try {
          await postService.delete(postId, userId);
        } catch (error) {
          expect(session.abortTransaction).toHaveBeenCalledOnce();
        }
      });

      it('should throw internal server error', async () => {
        vi.spyOn(commentModel, 'deleteMany').mockResolvedValueOnce({
          deletedCount: mockMongoPost.comments.length - 1,
          acknowledged: true,
        });

        try {
          expect(await postService.delete(postId, userId)).toEqual(undefined);
        } catch (error) {
          expect(error).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });

    it('should return undefined if post was successfully deleted', async () => {
      expect(await postService.delete(postId, userId)).toEqual(undefined);
    });

    it('should end session', async () => {
      const session = await connection.startSession();
      vi.spyOn(connection, 'startSession').mockImplementationOnce(() => session);

      await postService.delete(postId, userId);

      expect(session.endSession).toHaveBeenCalledOnce();
    });
  });
});
