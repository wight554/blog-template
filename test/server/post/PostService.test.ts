import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PostService } from '@server/post/PostService';
import { UserDocument } from '@server/user/schemas/UserSchema';
import { Post, PostDocument } from '@server/post/schemas/PostSchema';

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

const mockPostModel = {
  find: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockPosts),
  })),
  findById: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockPosts[0]),
  })),
  create: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockPosts[0]),
  })),
  findOneAndUpdate: vi.fn().mockImplementation(() => ({
    populate: vi.fn().mockResolvedValue(mockPosts[0]),
  })),
  deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
};

describe('PostService', () => {
  let postModel: Model<PostDocument>;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
      ],
    }).compile();

    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
    postService = module.get<PostService>(PostService);
  });

  describe('getAll', () => {
    it('should get post by id using post model', async () => {
      await postService.getAll();

      expect(postModel.find).toHaveBeenCalledOnce();
    });

    it('should return all posts', async () => {
      expect(await postService.getAll()).toEqual(mockPosts);
    });
  });

  describe('getById', () => {
    it('should get post by id using post model', async () => {
      await postService.getById(mockPostId);

      expect(postModel.findById).toHaveBeenCalledWith(mockPostId);
    });

    describe('post exists', () => {
      it('should return post', async () => {
        expect(await postService.getById(mockPostId)).toEqual(mockPosts[0]);
      });
    });

    describe('post does not exist', () => {
      it('should throw not found exception', async () => {
        vi.spyOn(postModel.findById(mockPostId), 'populate').mockResolvedValueOnce(null);

        try {
          await postService.getById(mockPostId);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('create', () => {
    it('should create post using post model', async () => {
      await postService.create(mockUpsertPost, mockUser.id);

      expect(postModel.create).toHaveBeenCalledWith({ ...mockUpsertPost, author: mockUser.id });
    });

    describe('post model success', () => {
      it('should return created post', async () => {
        expect(await postService.create(mockUpsertPost, mockUser.id)).toEqual(mockPosts[0]);
      });
    });
  });

  describe('update', () => {
    it('should get post by id', async () => {
      vi.spyOn(postService, 'getById');

      await postService.update(mockPostId, mockUpsertPost, mockUser.id);

      expect(postService.getById).toHaveBeenCalledWith(mockPostId);
    });

    it('should throw forbidden exception if author id does not match user id', async () => {
      vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{ author: { id: '2' } });

      try {
        await postService.update(mockPostId, mockUpsertPost, mockUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should update post using post model', async () => {
      await postService.update(mockPostId, mockUpsertPost, mockUser.id);

      expect(postModel.findOneAndUpdate).toHaveBeenCalledWith({ _id: mockPostId }, mockUpsertPost, {
        new: true,
      });
    });

    it('should return updated post', async () => {
      expect(await postService.update(mockPostId, mockUpsertPost, mockUser.id)).toEqual(
        mockPosts[0],
      );
    });
  });

  describe('delete', () => {
    it('should get post by id', async () => {
      vi.spyOn(postService, 'getById');

      await postService.delete(mockPostId, mockUser.id);

      expect(postService.getById).toHaveBeenCalledWith(mockPostId);
    });

    it('should throw forbidden exception if author id does not match user id', async () => {
      vi.spyOn(postService, 'getById').mockResolvedValueOnce(<PostDocument>{ author: { id: '2' } });

      try {
        await postService.delete(mockPostId, mockUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should delete post using post model', async () => {
      await postService.delete(mockPostId, mockUser.id);

      expect(postModel.deleteOne).toHaveBeenCalledWith({ _id: mockPostId });
    });

    it('should throw internal server error if deleted count is 0', async () => {
      vi.spyOn(postModel, 'deleteOne').mockResolvedValueOnce({
        deletedCount: 0,
        acknowledged: true,
      });

      try {
        expect(await postService.delete(mockPostId, mockUser.id)).toEqual(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should return undefined if deleted count is not 0', async () => {
      expect(await postService.delete(mockPostId, mockUser.id)).toEqual(undefined);
    });
  });
});
