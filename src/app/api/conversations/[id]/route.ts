import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { ConversationService } from '../../../../modules/conversations/services/ConversationService';
import { Message } from '../../../../infrastructure/database/entities/Message';

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
    const conversationService = new ConversationService(em);
    
    // Get conversation details
    const conversation = await conversationService.getConversation(conversationId);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch messages for this conversation
    const messages = await em.find(Message, 
      { conversation: conversationId }, 
      { orderBy: { createdAt: 'ASC' } }
    );

    console.log('Raw messages from DB:');
    messages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`, {
        id: msg.id,
        role: msg.role,
        content: msg.content.substring(0, 100) + '...',
        createdAt: msg.createdAt,
        conversationId: msg.conversation
      });
    });

    // Format messages for frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg.id.toString(),
      role: msg.role,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    }));

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      messages: formattedMessages
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
