import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@server/user/schemas/UserSchema';
import { Type } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

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
export class Post {
  id: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  createdAt: string;

  updatedAt: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
