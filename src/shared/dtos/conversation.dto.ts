import { z } from 'zod';
import { createConversationSchema, updateConversationSchema } from '../schemas/conversation.schema';
import { MessageDto } from './message.dto';

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

export interface ConversationDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithMessagesDto {
  conversation: ConversationDto;
  messages: MessageDto[];
}
