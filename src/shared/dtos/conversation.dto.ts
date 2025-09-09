import { z } from 'zod';
import { createConversationSchema, updateConversationSchema } from '../schemas/conversation.schema';

export type CreateConversationDto = z.infer<typeof createConversationSchema>;
export type UpdateConversationDto = z.infer<typeof updateConversationSchema>;

export interface ConversationDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithMessagesDto extends ConversationDto {
  messages: {
    id: number;
    content: string;
    role: 'user' | 'assistant';
    createdAt: string;
  }[];
}
