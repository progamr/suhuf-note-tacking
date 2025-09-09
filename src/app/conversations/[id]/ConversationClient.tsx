'use client';

import { useEffect, useState } from 'react';
import { ChatInterface } from '../../../modules/chat/components/ChatInterface';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationData {
  conversation: Conversation;
  messages: Message[];
}

interface ConversationClientProps {
  conversationId: string;
}

export function ConversationClient({ conversationId }: ConversationClientProps) {
  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversation() {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            window.location.href = '/';
            return;
          }
          throw new Error('Failed to fetch conversation');
        }

        const conversationData = await response.json();
        setData(conversationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();
  }, [conversationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">No conversation found</div>
      </div>
    );
  }

  return (
    <ChatInterface 
      conversationId={conversationId}
      initialMessages={data.messages}
      conversationTitle={data.conversation.title}
    />
  );
}
