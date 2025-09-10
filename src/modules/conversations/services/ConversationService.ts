import { ConversationRepository } from '../repositories/ConversationRepository';
import { ConversationDto, ConversationWithMessagesDto, CreateConversationDto } from '../../../shared/dtos/conversation.dto';

export class ConversationService {
  constructor(private readonly conversationRepository: ConversationRepository) {}

  async createConversation(userId: number, dto: CreateConversationDto): Promise<ConversationDto> {
    return await this.conversationRepository.createConversation(userId, dto.title);
  }

  async getUserConversations(userId: number): Promise<ConversationDto[]> {
    return await this.conversationRepository.findByUserId(userId);
  }

  async getConversation(id: string): Promise<ConversationDto | null> {
    return await this.conversationRepository.findById(id);
  }

  async getConversationWithMessages(id: string): Promise<ConversationWithMessagesDto | null> {
    return await this.conversationRepository.findWithMessages(id);
  }
}
