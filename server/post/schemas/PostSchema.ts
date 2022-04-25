import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose from 'mongoose';

import { Comment } from '@server/comment/schemas/CommentSchema.js';
import { User } from '@server/user/schemas/UserSchema.js';

export type PostDocument = Post & mongoose.Document;

@Schema({
  toJSON: {
    versionKey: false,
    getters: true,
  },
  timestamps: true,
})
export class Post {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  @Type(() => Comment)
  comments: Array<Comment>;

  @Exclude()
  _id?: mongoose.Types.ObjectId;

  id: string;

  createdAt: string;

  updatedAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
