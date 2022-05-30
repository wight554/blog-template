import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import mongoose from 'mongoose';

import { User } from '#server/user/schemas/UserSchema.js';

export type CommentDocument = Comment & mongoose.Document;

@Schema({
  toJSON: {
    versionKey: false,
    getters: true,
  },
  timestamps: true,
})
export class Comment {
  @Prop({ type: String })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  @Transform(({ value }) => value.toString())
  postId: string;

  @Exclude()
  _id?: mongoose.Types.ObjectId;

  id: string;

  createdAt: string;

  updatedAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
