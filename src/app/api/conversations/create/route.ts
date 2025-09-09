import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { ConversationService } from '../../../../modules/conversations/services/ConversationService';
import { LangChainService } from '../../../../modules/chat/services/LangChainService';
import { NoteService } from '../../../../modules/notes/services/NoteService';
import { NotesRepository } from '../../../../modules/notes/repositories/NotesRepository';
import { Note } from '../../../../infrastructure/database/entities/Note';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstMessage } = body;

    if (!firstMessage || typeof firstMessage !== 'string') {
      return NextResponse.json({ error: 'First message is required' }, { status: 400 });
    }

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

    // Handle note saving if detected
    let noteSaved = false;
    console.log('🔍 Checking for note intent in aiResponse:', aiResponse);
    if (aiResponse.shouldSaveAsNote) {
      try {
        console.log('💾 Attempting to save note:', aiResponse.shouldSaveAsNote);
        const noteService = new NoteService(notesRepository);
        const savedNote = await noteService.createNote(
          userId,
          aiResponse.shouldSaveAsNote.title,
          aiResponse.shouldSaveAsNote.content,
          conversation.id
        );
        
        noteSaved = true;
        console.log('✅ Note saved successfully:', savedNote);
      } catch (error) {
        console.error('💥 Error saving note:', error);
      }
    } else {
      console.log('❌ No note intent detected in aiResponse');
    }

    console.log('AI Response, DEBUG',aiResponse);
    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        firstMessage,
        aiResponse: aiResponse.response,
        noteSaved
      }
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
