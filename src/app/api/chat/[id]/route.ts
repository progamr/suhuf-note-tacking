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
    const result = await langChainService.processMessage(conversationId, message);

    // Handle note saving if detected
    let noteSaved = false;
    console.log('🔍 Chat API - Checking for note intent in result:', result);
    if (result.shouldSaveAsNote) {
      try {
        console.log('💾 Chat API - Attempting to save note:', result.shouldSaveAsNote);
        const { NoteService } = await import('../../../../modules/notes/services/NoteService');
        const noteService = new NoteService(em);
        
        const savedNote = await noteService.createNote(
          parseInt(session.user.id || '2'),
          result.shouldSaveAsNote.title,
          result.shouldSaveAsNote.content,
          conversationId
        );
        
        noteSaved = true;
        console.log('✅ Chat API - Note saved successfully:', savedNote);
      } catch (error) {
        console.error('💥 Chat API - Error saving note:', error);
      }
    } else {
      console.log('❌ Chat API - No note intent detected in result');
    }

    return NextResponse.json({
      success: true,
      response: result.response,
      noteSaved: noteSaved
    });

  } catch (error) {
    console.error('Error in chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
