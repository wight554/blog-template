import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Post, PostDocument } from '@server/post/schemas/PostSchema';
import { CreatePostDto } from '@server/post/dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAll(): Promise<Array<PostDocument>> {
    return this.postModel.find().populate('author');
  }

  async getById(postId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId).populate('author');

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async create(post: CreatePostDto, userId: string): Promise<PostDocument> {
    const createdPost = await this.postModel.create({ ...post, author: userId });

    return createdPost.populate('author');
  }

  async update(postId: string, post: UpdatePostDto, userId: string): Promise<PostDocument> {
    const { author } = await this.getById(postId);

    if (author.id !== userId) {
      throw new ForbiddenException();
    }

    const updatedPost = await this.postModel.findOneAndUpdate({ _id: postId }, post, {
      new: true,
    });

    if (!updatedPost) {
      throw new NotFoundException();
    }

    return updatedPost.populate('author');
  }

  async delete(postId: string, userId: string): Promise<void> {
    const { author } = await this.getById(postId);

    if (author.id !== userId) {
      throw new ForbiddenException();
    }

    const { deletedCount } = await this.postModel.deleteOne({ _id: postId });

    if (deletedCount === 0) {
      throw new InternalServerErrorException('Post was not deleted');
    }
  }
}
