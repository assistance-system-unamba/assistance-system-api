export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  existsByUserName(userName: string): Promise<boolean>;
}
