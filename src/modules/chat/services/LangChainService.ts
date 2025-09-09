import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { EntityManager } from '@mikro-orm/core';
import { Message } from '../../../infrastructure/database/entities/Message';
import { Conversation } from '../../../infrastructure/database/entities/Conversation';

export class LangChainService {
  private llm: ChatGoogleGenerativeAI;
  private memories: Map<string, BufferMemory> = new Map();

  constructor(private readonly em: EntityManager) {
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      apiKey: 'AIzaSyBMaR4a2chRnZ2e8gV63k6CE1sfoWUbyrA',
    });
  }

  async getOrCreateMemory(conversationId: string): Promise<BufferMemory> {
    if (this.memories.has(conversationId)) {
      return this.memories.get(conversationId)!;
    }

    const memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });

    // Load existing messages from database
    const messages = await this.em.find(Message, 
      { conversation: { id: conversationId } }, 
      { orderBy: { createdAt: 'ASC' } }
    );

    // Add existing messages to memory
    for (const message of messages) {
      if (message.role === 'user') {
        await memory.chatHistory.addMessage(new HumanMessage(message.content));
      } else {
        await memory.chatHistory.addMessage(new AIMessage(message.content));
      }
    }

    this.memories.set(conversationId, memory);
    return memory;
  }

  async processMessage(conversationId: string, userMessage: string): Promise<{ response: string; shouldSaveAsNote?: { title: string; content: string } }> {
    const memory = await this.getOrCreateMemory(conversationId);
    
    console.log('🚀 Processing message:', userMessage);
    
    // Check if user wants to save something as a note
    const noteIntent = await this.detectNoteIntent(userMessage);
    console.log('🔍 Note intent result:', noteIntent);
    
    const chain = new ConversationChain({
      llm: this.llm,
      memory: memory,
      verbose: true,
    });

    // Get AI response
    const response = await chain.call({
      input: userMessage,
    });

    // Save both messages to database
    await this.saveMessages(conversationId, userMessage, response.response);

    const result: { response: string; shouldSaveAsNote?: { title: string; content: string } } = {
      response: response.response
    };

    if (noteIntent) {
      result.shouldSaveAsNote = noteIntent;
      console.log('✅ Adding note intent to result:', noteIntent);
    } else {
      console.log('❌ No note intent to add to result');
    }

    console.log('📤 Final result:', { hasNote: !!result.shouldSaveAsNote, response: result.response.substring(0, 100) });
    return result;
  }

  private async saveMessages(conversationId: string, userMessage: string, aiResponse: string): Promise<void> {
    const conversation = await this.em.findOne(Conversation, conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    console.log('Saving messages for conversation:', conversationId);
    console.log('User message:', userMessage.substring(0, 100));
    console.log('AI response:', aiResponse.substring(0, 100));

    // Save user message
    const userMsg = this.em.create(Message, {
      conversation: this.em.getReference(Conversation, conversationId),
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    });

    // Save AI response
    const aiMsg = this.em.create(Message, {
      conversation: this.em.getReference(Conversation, conversationId),
      role: 'assistant',
      content: aiResponse,
      createdAt: new Date(),
    });

    console.log('Created user message entity:', { role: userMsg.role, content: userMsg.content.substring(0, 50) });
    console.log('Created AI message entity:', { role: aiMsg.role, content: aiMsg.content.substring(0, 50) });

    await this.em.persistAndFlush([userMsg, aiMsg]);
    console.log('Messages saved successfully');
  }

  async saveMessage(conversationId: string, content: string, role: 'user' | 'assistant'): Promise<void> {
    try {
      const conversation = await this.em.findOne(Conversation, conversationId);
      
      if (!conversation) {
        throw new Error(`Conversation not found: ${conversationId}`);
      }

      console.log('Saving message for conversation:', conversationId, 'role:', role);
      
      const messageEntity = this.em.create(Message, {
        conversation: this.em.getReference(Conversation, conversationId),
        role,
        content,
        createdAt: new Date(),
      });

      await this.em.persistAndFlush(messageEntity);
      console.log('Message saved successfully');
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const prompt = `Generate a short, descriptive title (max 5 words) for a conversation that starts with: "${firstMessage}". Return only the title, no quotes or extra text.`;
      
      const response = await this.llm.invoke([
        { role: 'user', content: prompt }
      ]);
      
      return response.content.toString().trim();
    } catch (error) {
      console.error('Error generating title:', error);
      return 'New Conversation';
    }
  }

  async loadMessages(conversationId: string): Promise<Array<{ role: string; content: string }>> {
    try {
      const messages = await this.em.find(Message, 
        { conversation: { id: conversationId } }, 
        { orderBy: { createdAt: 'ASC' } }
      );

      return messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  async detectNoteIntent(userMessage: string): Promise<{ title: string; content: string } | null> {
    try {
      const prompt = `Analyze this user message and determine if they want to save something as a note. Look for phrases like "save this as a note", "remember this", "take a note", "write this down", "Save this as a note", etc.

User message: "${userMessage}"

If they want to save something as a note, respond with JSON in this format:
{
  "isNote": true,
  "title": "Brief title (max 50 chars)",
  "content": "The content they want to save"
}

If they don't want to save anything as a note, respond with:
{
  "isNote": false
}

Only respond with valid JSON, nothing else.`;

      console.log('🔍 Note Detection - User Message:', userMessage);
      
      const response = await this.llm.invoke([
        { role: 'user', content: prompt }
      ]);

      const responseText = response.content.toString().trim();
      console.log('🤖 Note Detection - AI Response:', responseText);
      
      // Extract JSON from markdown code blocks if present
      let jsonText = responseText;
      const jsonMatch = responseText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
        console.log('📋 Extracted JSON from markdown:', jsonText);
      }
      
      const result = JSON.parse(jsonText);
      console.log('📝 Note Detection - Parsed Result:', result);
      
      if (result.isNote && result.title && result.content) {
        console.log('✅ Note Intent Detected:', { title: result.title, content: result.content });
        return {
          title: result.title,
          content: result.content
        };
      }

      console.log('❌ No Note Intent Detected');
      return null;
    } catch (error) {
      console.error('💥 Error detecting note intent:', error);
      return null;
    }
  }

  clearMemory(conversationId: string): void {
    this.memories.delete(conversationId);
  }
}
