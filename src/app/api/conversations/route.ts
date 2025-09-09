import { NextRequest, NextResponse } from 'next/server';
import { DI } from '../../../infrastructure/database/di';
import { ConversationService } from '../../../modules/conversations/services/ConversationService';
import { createConversationSchema } from '../../../shared/schemas/conversation.schema';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = createConversationSchema.parse(body);
    
    // For demo purposes, we'll use a mock user ID
    const userId = 1;
    
    const em = await DI.getEntityManager();
    const conversationService = new ConversationService(em);
    
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
    const { auth } = await import('../../../modules/auth/config/auth.config');
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fix user ID issue - using mock user ID for now
    const userId = parseInt(session.user.id || '2');
    
    const em = await DI.getEntityManager();
    const conversationService = new ConversationService(em);
    
    const conversations = await conversationService.getUserConversations(userId);
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
