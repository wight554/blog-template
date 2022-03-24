import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Comment } from '@server/comment/schemas/CommentSchema';
import { User } from '@server/user/schemas/UserSchema';

export type PostDocument = Post & Document;

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Comment.name }] })
  @Type(() => Comment)
  comments: Array<Comment>;

  @Exclude()
  _id?: Types.ObjectId;

  id: string;

  createdAt: string;

  updatedAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
