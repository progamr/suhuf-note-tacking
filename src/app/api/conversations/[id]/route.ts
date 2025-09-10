import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { ConversationService } from '../../../../modules/conversations/services/ConversationService';
import { ConversationRepository } from '../../../../modules/conversations/repositories/ConversationRepository';
import { Conversation } from '../../../../infrastructure/database/entities/Conversation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = params.id;
    const em = await DI.getEntityManager();
    const conversationRepository = new ConversationRepository(em, Conversation);
    const conversationService = new ConversationService(conversationRepository);
    
    // Get conversation with messages
    const conversationWithMessages = await conversationService.getConversationWithMessages(conversationId);
    
    if (!conversationWithMessages) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversationWithMessages);

  } catch (error) {
    console.error('Error fetching conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
