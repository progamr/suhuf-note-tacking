import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long')
});

export const updateConversationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long')
});
