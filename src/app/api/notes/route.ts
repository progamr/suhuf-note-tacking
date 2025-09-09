import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../modules/auth/config/auth.config';
import { DI } from '../../../infrastructure/database/di';
import { NoteService } from '../../../modules/notes/services/NoteService';
import { NotesRepository } from '../../../modules/notes/repositories/NotesRepository';
import { Note } from '../../../infrastructure/database/entities/Note';
import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  conversationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const noteService = new NoteService(notesRepository);
    
    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);
    
    const userId = parseInt(session.user.id || '2');
    
    const note = await noteService.createNote(
      userId,
      validatedData.title,
      validatedData.content,
      validatedData.conversationId
    );
    
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const noteService = new NoteService(notesRepository);
    
    const userId = parseInt(session.user.id || '2');
   
    const notes = await noteService.getNotesByUserId(userId);
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
