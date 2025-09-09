import { EntityManager } from '@mikro-orm/core';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';
import { User } from '../../../infrastructure/database/entities/User';
import { ConversationDto, CreateConversationDto } from '../../../shared/dtos/conversation.dto';

export class ConversationService {
  constructor(private readonly em: EntityManager) {}

  async createConversation(userId: number, dto: CreateConversationDto): Promise<ConversationDto> {
    const user = await this.em.findOne(User, 2);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const conversation = this.em.create(Conversation, {
      user,
      title: dto.title,
      messages: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await this.em.persistAndFlush(conversation);
    
    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    };
  }

  async getUserConversations(userId: number): Promise<ConversationDto[]> {
    const conversations = await this.em.find(Conversation, { user: { id: userId } }, {
      orderBy: { createdAt: 'DESC' }
    });

    console.log('conversationszzzz', conversations);
    
    return conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    }));
  }

  async getConversation(id: string): Promise<ConversationDto | null> {
    const conversation = await this.em.findOne(Conversation, id, {
      populate: ['messages']
    });
    
    if (!conversation) {
      return null;
    }
    
    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString()
    };
  }
}
