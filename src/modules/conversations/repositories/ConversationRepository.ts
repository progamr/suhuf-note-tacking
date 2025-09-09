import { EntityRepository } from '@mikro-orm/core';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';

export class ConversationRepository extends EntityRepository<Conversation> {
  async findByUserId(userId: number): Promise<Conversation[]> {
    return this.find({ user: { id: userId } }, { orderBy: { createdAt: 'DESC' } });
  }
  
  async findWithMessages(id: string): Promise<Conversation | null> {
    return this.findOne(id, {
      populate: ['messages']
    });
  }
}
