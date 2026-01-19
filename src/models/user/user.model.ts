import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
}
