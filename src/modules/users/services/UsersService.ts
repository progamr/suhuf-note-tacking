import { EntityManager } from '@mikro-orm/core';
import { User } from '../../../infrastructure/database/entities/User';
import { UsersRepository } from '../repositories/UsersRepository';

export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const repository = new UsersRepository(this.em, User);
    return repository.findByEmail(email);
  }

  async create(name: string, email: string, passwordHash: string): Promise<User | null> {
    const repository = new UsersRepository(this.em, User);
    return repository.createUser(name, email, passwordHash);
  }
}
