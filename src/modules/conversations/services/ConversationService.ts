import { ConversationRepository } from '../repositories/ConversationRepository';
import { ConversationDto, ConversationWithMessagesDto } from '../../../shared/dtos/conversation.dto';
import { NotesRepository } from '../../../modules/notes/repositories/NotesRepository';
import { LangChainService } from '../../../modules/chat/services/LangChainService';
import { NoteService } from '../../../modules/notes/services/NoteService';
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly notesRepository: NotesRepository,
    private readonly langChainService: LangChainService,
    private readonly noteService: NoteService,
  ) { }

  async createConversation(
    userId: number,
    firstMessage: string,
  ): Promise<ConversationDto> {
    // Generate title from first message
    const title = await this.langChainService.generateTitle(firstMessage);
    const conversation = await this.conversationRepository.createConversation(userId, title);

    // Process first message and get AI response
    const aiResponse = await this.langChainService.processMessage(conversation.id, firstMessage);

    // Handle note saving if detected
    let noteSaved = false;
    console.log('🔍 Checking for note intent in aiResponse:', aiResponse);
    if (aiResponse.shouldSaveAsNote) {
      try {
        console.log('💾 Attempting to save note:', aiResponse.shouldSaveAsNote);
        const savedNote = await this.noteService.createNote(
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


    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      firstMessage,
      aiResponse: aiResponse,
      noteSaved
    };
  }

  async getUserConversations(userId: number): Promise<ConversationDto[]> {
    return await this.conversationRepository.findByUserId(userId);
  }

  async getConversation(id: string): Promise<ConversationDto | null> {
    return await this.conversationRepository.findById(id);
  }

  async getConversationWithMessages(id: string): Promise<ConversationWithMessagesDto | null> {
    return await this.conversationRepository.findWithMessages(id);
  }
}
