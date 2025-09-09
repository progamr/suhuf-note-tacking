import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { LangChainService } from '../../../../modules/chat/services/LangChainService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();
    const conversationId = params.id;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const em = await DI.getEntityManager();
    const langChainService = new LangChainService(em);

    // Process message through LangChain for context management and get AI response
    const aiResponse = await langChainService.processMessage(conversationId, message);

    return NextResponse.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
