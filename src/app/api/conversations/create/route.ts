import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { ConversationService } from '../../../../modules/conversations/services/ConversationService';
import { LangChainService } from '../../../../modules/chat/services/LangChainService';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstMessage } = body;

    if (!firstMessage || typeof firstMessage !== 'string') {
      return NextResponse.json({ error: 'First message is required' }, { status: 400 });
    }

    const em = await DI.getEntityManager();
    const conversationService = new ConversationService(em);
    const langChainService = new LangChainService(em);

    // Generate title from first message
    const title = await langChainService.generateTitle(firstMessage);

    // Create conversation
    console.log('Session, DEBUG',session);
    //TODO: Fix ASAP as this is a temporary fix
    const userId = parseInt(session.user.id || '2');
    console.log('UID, DEBUG',userId);
    if (isNaN(userId) || userId === 0) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const conversation = await conversationService.createConversation(
      userId, 
      { title }
    );

    // Process first message and get AI response
    const aiResponse = await langChainService.processMessage(conversation.id, firstMessage);

    console.log('AI Response, DEBUG',aiResponse);
    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        firstMessage,
        aiResponse
      }
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
