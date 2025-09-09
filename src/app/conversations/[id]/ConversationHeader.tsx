'use client';

import { useEffect, useState } from 'react';

interface ConversationHeaderProps {
  conversationId: string;
}

export function ConversationHeader({ conversationId }: ConversationHeaderProps) {
  const [title, setTitle] = useState('Conversation');

  useEffect(() => {
    async function fetchTitle() {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.conversation.title);
        }
      } catch (error) {
        console.error('Failed to fetch conversation title:', error);
      }
    }

    fetchTitle();
  }, [conversationId]);

  return (
    <h1 className="text-xl font-bold font-sketch">{title}</h1>
  );
}
