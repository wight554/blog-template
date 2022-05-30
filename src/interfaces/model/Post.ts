import { User } from '@src/interfaces/model/User';

export interface Post {
  title: string;
  description: string;
  author: User;
  createdAt: string;
}
