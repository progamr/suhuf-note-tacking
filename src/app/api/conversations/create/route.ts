import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { ConversationService } from '../../../../modules/conversations/services/ConversationService';
import { ConversationRepository } from '../../../../modules/conversations/repositories/ConversationRepository';
import { LangChainService } from '../../../../modules/chat/services/LangChainService';
import { NoteService } from '../../../../modules/notes/services/NoteService';
import { NotesRepository } from '../../../../modules/notes/repositories/NotesRepository';
import { Note } from '../../../../infrastructure/database/entities/Note';
import { Conversation } from '../../../../infrastructure/database/entities/Conversation';

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

    // Create conversation
    console.log('Session, DEBUG',session);
    //TODO: Fix ASAP as this is a temporary fix
    const userId = parseInt(session.user.id || '2');
    console.log('UID, DEBUG',userId);
    if (isNaN(userId) || userId === 0) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const conversationRepository = new ConversationRepository(em, Conversation);
    const langChainService = new LangChainService(em);
    const noteService = new NoteService(notesRepository);
    const conversationService = new ConversationService(conversationRepository, notesRepository, langChainService, noteService);
    
    const conversation = await conversationService.createConversation(
      userId, 
      firstMessage
    );

    return NextResponse.json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
