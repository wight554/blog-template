import { Model, Connection as MongooseConnection } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Post, PostDocument } from '@server/post/schemas/PostSchema';
import { CreatePostDto } from '@server/post/dto/CreatePostDto';
import { UpdatePostDto } from '@server/post/dto/UpdatePostDto';
import { Comment, CommentDocument } from '@server/comment/schemas/CommentSchema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectConnection() private readonly connection: MongooseConnection,
  ) {}

  async getAll(): Promise<Array<PostDocument>> {
    return this.postModel.find().populate('author').select('-comments');
  }

  async getById(postId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException();
    }

    return post.populate([
      'author',
      {
        path: 'comments',
        populate: 'author',
      },
    ]);
  }

  async create(post: CreatePostDto, userId: string): Promise<PostDocument> {
    const createdPost = await this.postModel.create({ ...post, author: userId });

    return createdPost.populate([
      'author',
      {
        path: 'comments',
        populate: 'author',
      },
    ]);
  }

  async update(postId: string, post: UpdatePostDto, userId: string): Promise<PostDocument> {
    const { author } = await this.getById(postId);

    if (author.id !== userId) {
      throw new ForbiddenException();
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(postId, post, { new: true });

    if (!updatedPost) {
      throw new NotFoundException();
    }

    return updatedPost.populate([
      'author',
      {
        path: 'comments',
        populate: 'author',
      },
    ]);
  }

  async delete(postId: string, userId: string): Promise<void> {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      const { author, comments } = await this.getById(postId);

      if (author.id !== userId) {
        throw new ForbiddenException();
      }

      const { deletedCount } = await this.postModel.deleteOne({ _id: postId });

      const commentIds = comments.map(({ id }) => id);

      const { deletedCount: deletedCommentsCount } = await this.commentModel.deleteMany({
        _id: {
          $in: commentIds,
        },
      });

      if (deletedCount === 0 || deletedCommentsCount < commentIds.length) {
        throw new InternalServerErrorException('Post was not deleted');
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }
}
