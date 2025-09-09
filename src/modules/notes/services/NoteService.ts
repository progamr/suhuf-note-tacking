import { EntityManager } from '@mikro-orm/core';
import { Note } from '../../../infrastructure/database/entities/Note';

export class NoteService {
  constructor(private em: EntityManager) {}

  async createNote(userId: number, title: string, content: string, conversationId?: string) {
    const note = new Note();
    note.user = userId as unknown;
    note.title = title;
    note.content = content;
    
    if (conversationId) {
      note.conversation = conversationId as unknown;
    }

    await this.em.persistAndFlush(note);
    
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  async getUserNotes(userId: number) {
    const notes = await this.em.find(Note, { user: { id: userId } }, {
      orderBy: { createdAt: 'DESC' }
    });
    
    return notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }));
  }

  async getNote(noteId: number) {
    const note = await this.em.findOne(Note, { id: noteId });
    
    if (!note) {
      return null;
    }

    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }

  async updateNote(noteId: number, title: string, content: string) {
    const note = await this.em.findOne(Note, { id: noteId });
    
    if (!note) {
      return null;
    }

    note.title = title;
    note.content = content;
    note.updatedAt = new Date();

    await this.em.persistAndFlush(note);
    
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    };
  }

  async deleteNote(noteId: number) {
    const note = await this.em.findOne(Note, { id: noteId });
    
    if (!note) {
      return false;
    }

    await this.em.removeAndFlush(note);
    return true;
  }
}
