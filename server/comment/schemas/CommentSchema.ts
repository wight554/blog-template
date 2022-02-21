import { Post } from '@server/post/schemas/PostSchema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@server/user/schemas/UserSchema';
import { Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
    },
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
  @Type(() => Post)
  post: Post;

  id: string;

  createdAt: string;

  updatedAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
