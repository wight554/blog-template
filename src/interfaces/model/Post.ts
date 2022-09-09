import { User } from '#src/interfaces/model/User.js';

export interface Post {
  id: string;
  title: string;
  description: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}
