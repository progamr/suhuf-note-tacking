'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Card, CardContent, Input } from '../../../ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: Message[];
  conversationTitle: string;
}

export function ChatInterface({ conversationId, initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch(`/api/chat/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add AI response to UI
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
        {messages.map((message) => (
          <Card key={message.id} className={`max-w-2xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold font-sketch capitalize">{message.role}</span>
                <span className="text-sm text-muted-foreground font-sans">
                  {formatTime(message.createdAt)}
                </span>
              </div>
              <p className="font-sans whitespace-pre-wrap">{message.content}</p>
            </CardContent>
          </Card>
        ))}
        {isLoading && (
          <Card className="max-w-2xl mr-auto">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold font-sketch">Assistant</span>
                <span className="text-sm text-muted-foreground font-sans">typing...</span>
              </div>
              <p className="font-sans text-muted-foreground">Thinking...</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="border-t-2 border-foreground pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
