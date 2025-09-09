import { EntityRepository } from '@mikro-orm/core';
import { Note } from '../../../infrastructure/database/entities/Note';
import { NoteDto } from '../../../shared/dtos';

const toNoteDto: (note: Note) => NoteDto = (note: Note) => ({
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
});

export class NotesRepository extends EntityRepository<Note> {
    async findByUserId(userId: number): Promise<NoteDto | null> {
        const note = await this.findOne({ user: { id: userId } });
        
        if (!note) {
            return null;
        }
        
        return toNoteDto(note);
    }

    async findAllByUserId(userId: number): Promise<NoteDto[] | null> {
        const notes = await this.find({ user: { id: userId } }, { orderBy: { createdAt: 'DESC' } });

        return notes.map(toNoteDto);
    }

    async createNote(userId: number, title: string, content: string, conversationId?: string): Promise<NoteDto> {
        const note = new Note();
        note.user = userId as unknown;
        note.title = title;
        note.content = content;
        
        if (conversationId) {
            note.conversation = conversationId as unknown;
        }

        this.em.persist(note);
        await this.em.flush();
        
        return toNoteDto(note);
    }

    async findById(noteId: number): Promise<NoteDto | null> {
        const note = await this.findOne({ id: noteId });
        
        if (!note) {
            return null;
        }

        return toNoteDto(note);
    }

    async updateNote(noteId: number, title: string, content: string): Promise<NoteDto | null> {
        const note = await this.findOne({ id: noteId });
        
        if (!note) {
            return null;
        }

        note.title = title;
        note.content = content;
        note.updatedAt = new Date();

        this.em.persist(note);
        await this.em.flush();
        
        return toNoteDto(note);
    }

    async deleteNote(noteId: number): Promise<boolean> {
        const note = await this.findOne({ id: noteId });
        
        if (!note) {
            return false;
        }

        this.em.remove(note);
        await this.em.flush();
        return true;
    }
}
