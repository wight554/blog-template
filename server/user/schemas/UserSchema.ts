import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
      ret.id = ret._id.toString();
      delete ret._id;
    },
  },
})
export class User {
  id: string;

  @Prop({ unique: true, type: String })
  username: string;

  @Prop({ type: String })
  @Exclude()
  password?: string;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
