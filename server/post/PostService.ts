import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '@server/post/schemas/PostSchema';

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
}
