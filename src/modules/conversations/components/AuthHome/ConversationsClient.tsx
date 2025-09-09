'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../../ui';

type ConversationData = {
  id: string;
  title: string;
  createdAt: string;
  messages?: Array<{ content: string }>;
};

export function ConversationsClient() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch('/api/conversations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button asChild className="flex items-center gap-2">
          <Link href="/?new-chat=true">
            <PlusCircle size={18} />
            <span>New Conversation</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {conversations.length > 0 ? conversations.map(conversation => {
          const timeAgo = new Date(conversation.createdAt).toLocaleDateString();
          return (
            <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
              <Card className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{conversation.title}</CardTitle>
                    <span className="text-sm text-muted-foreground font-sans">{timeAgo}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-sans truncate">
                    {conversation.messages?.[0]?.content || 'No messages yet'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        }) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-sans">No conversations yet. Start your first chat!</p>
          </div>
        )}
      </div>
    </div>
  );
}
