import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../modules/auth/config/auth.config';
import { DI } from '../../../../infrastructure/database/di';
import { NoteService } from '../../../../modules/notes/services/NoteService';
import { NotesRepository } from '../../../../modules/notes/repositories/NotesRepository';
import { Note } from '../../../../infrastructure/database/entities';

const updateNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const noteService = new NoteService(notesRepository);
       
    const noteId = parseInt(params.id);
    
    const note = await noteService.getNote(noteId);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const noteService = new NoteService(notesRepository);
    
    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);
    
    const noteId = parseInt(params.id);
    const note = await noteService.updateNote(
      noteId,
      validatedData.title,
      validatedData.content
    );
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const em = await DI.getEntityManager();
    const notesRepository = new NotesRepository(em, Note);
    const noteService = new NoteService(notesRepository);
    
    const noteId = parseInt(params.id);    
    const deleted = await noteService.deleteNote(noteId);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
