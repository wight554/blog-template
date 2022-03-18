import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    versionKey: false,
    getters: true,
  },
})
export class User {
  @Prop({ unique: true, type: String })
  username: string;

  @Prop({ type: String })
  @Exclude()
  password?: string;

  @Prop({ type: String })
  firstName?: string;

  @Prop({ type: String })
  lastName?: string;

  @Exclude()
  _id?: Types.ObjectId;

  id: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
