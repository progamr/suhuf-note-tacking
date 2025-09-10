import { EntityRepository } from '@mikro-orm/core';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';
import { Message } from '../../../infrastructure/database/entities/Message';
import { ConversationDto, ConversationWithMessagesDto } from '../../../shared/dtos';
import { MessageDto } from '../../../shared/dtos/message.dto';

const toConversationDto = (conversation: Conversation): ConversationDto => ({
  id: conversation.id,
  title: conversation.title,
  createdAt: conversation.createdAt.toISOString(),
  updatedAt: conversation.updatedAt.toISOString(),
});

const toConversationWithMessagesDto = (conversation: Conversation): ConversationWithMessagesDto => ({
  id: conversation.id,
  title: conversation.title,
  createdAt: conversation.createdAt.toISOString(),
  updatedAt: conversation.updatedAt.toISOString(),
  messages: (conversation.messages as Message[])?.map((message: Message) => ({
    id: message.id,
    content: message.content,
    role: message.role as 'user' | 'assistant',
    createdAt: message.createdAt.toISOString(),
  })) || [],
});

export class ConversationRepository extends EntityRepository<Conversation> {
  async findByUserId(userId: number): Promise<ConversationDto[]> {
    const conversations = await this.find({ user: { id: userId } }, { orderBy: { createdAt: 'DESC' } });
    return conversations.map(toConversationDto);
  }
  
  async findWithMessages(id: string): Promise<ConversationWithMessagesDto | null> {
    const conversation = await this.findOne(id, {
      populate: ['messages']
    });
    
    if (!conversation) {
      return null;
    }
    
    return {
      conversation: {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    },
    messages: conversation.messages as MessageDto[],
   };
  }

  async createConversation(userId: number, title: string): Promise<ConversationDto> {
    const conversation = new Conversation();
    conversation.user = userId as unknown;
    conversation.title = title;

    this.em.persist(conversation);
    await this.em.flush();
    
    return toConversationDto(conversation);
  }

  async findById(id: string): Promise<ConversationDto | null> {
    const conversation = await this.findOne({ id });
    
    if (!conversation) {
      return null;
    }

    return toConversationDto(conversation);
  }
}
