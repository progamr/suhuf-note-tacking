import { EntityRepository } from '@mikro-orm/core';
import { User } from '../../../infrastructure/database/entities/User';

export class UsersRepository extends EntityRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.em.findOne(User, { email });
    if (!user) {
      return null;
    }
    return user;
  }
  
  async createUser(name: string, email: string, passwordHash: string): Promise<User | null> {
    const user = this.em.create(User, {
        name,
        email,
        passwordHash,
        conversations: [],
        notes: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await this.em.persistAndFlush(user);
      return user;
  }
}
