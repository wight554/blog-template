import { User } from '#src/interfaces/model/User.js';

export interface Post {
  title: string;
  description: string;
  author: User;
  createdAt: string;
}
