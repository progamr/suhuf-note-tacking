import { z } from 'zod';
import { createConversationSchema, updateConversationSchema } from '../schemas/conversation.schema';
import { MessageDto } from './message.dto';

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

export interface AIResponse {
  response: string;
  shouldSaveAsNote?: {
    title: string; content: string
  }
}
export interface ConversationDto {
  id: string;
  title: string;
  createdAt: string;
  firstMessage: string,
  aiResponse: AIResponse,
  noteSaved: boolean;
}

export interface ConversationWithMessagesDto {
  conversation: ConversationDto;
  messages: MessageDto[];
}
