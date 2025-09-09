import { NoteDto } from '../../../shared/dtos';
import { NotesRepository } from '../repositories/NotesRepository';

export class NoteService {
  constructor(private notesRepository: NotesRepository) {}

  async createNote(userId: number, title: string, content: string, conversationId?: string) {
    const savedNote = await this.notesRepository.createNote(userId, title, content, conversationId);
    
    return savedNote;
  }

  async getNotesByUserId(userId: number): Promise<NoteDto[] | null> {
    return await this.notesRepository.findAllByUserId(userId);
  }

  async getNote(noteId: number): Promise<NoteDto | null> {
    const note = await this.notesRepository.findById(noteId);
    
    return note;
  }

  async updateNote(noteId: number, title: string, content: string): Promise<NoteDto | null> {
    const updatedNote = await this.notesRepository.updateNote(noteId, title, content);
    
    return updatedNote;
  }

  async deleteNote(noteId: number): Promise<boolean> {
    return await this.notesRepository.deleteNote(noteId);
  }
}
