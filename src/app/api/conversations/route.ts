import { NextRequest, NextResponse } from 'next/server';
import { DI } from '../../../infrastructure/database/di';
import { ConversationService } from '../../../modules/conversations/services/ConversationService';
import { ConversationRepository } from '../../../modules/conversations/repositories/ConversationRepository';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';
import { createConversationSchema } from '../../../shared/schemas/conversation.schema';
import { z } from 'zod';
import { auth } from '../../../modules/auth/config/auth.config';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    
    // Validate input
    const validatedData = createConversationSchema.parse(body);
    
     // TODO: Fix user ID issue - using mock user ID for now
    const userId = parseInt(session.user.id || '2');
    
    const em = await DI.getEntityManager();
    const conversationRepository = new ConversationRepository(em, Conversation);
    const conversationService = new ConversationService(conversationRepository);
    
    const conversation = await conversationService.createConversation(userId, validatedData);
    
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fix user ID issue - using mock user ID for now
    const userId = parseInt(session.user.id || '2');
    
    const em = await DI.getEntityManager();
    const conversationRepository = new ConversationRepository(em, Conversation);
    const conversationService = new ConversationService(conversationRepository);
    
    const conversations = await conversationService.getUserConversations(userId);
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
