import { NextResponse } from 'next/server';
import { DI } from '../../../infrastructure/database/di';
import { ConversationService } from '../../../modules/conversations/services/ConversationService';
import { ConversationRepository } from '../../../modules/conversations/repositories/ConversationRepository';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';
import { auth } from '../../../modules/auth/config/auth.config';

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
