import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { User } from '@server/user/schemas/UserSchema';

export type CommentDocument = Comment & Document;

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post' })
  @Transform(({ value }) => value.toString())
  postId: string;

  @Exclude()
  _id?: Types.ObjectId;

  id: string;

  createdAt: string;

  updatedAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
