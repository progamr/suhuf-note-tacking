'use client';

import { useState } from 'react';
import { Send, MoreHorizontal } from 'lucide-react';
import { Button, Card, CardContent } from '../../../ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      
      // Show toast if note was saved
      if (data.noteSaved) {
        toast.success(`Note saved: "${data.noteSaved.title}"`);
      }
      
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

  const saveMessageAsNote = async (message: Message) => {
    try {
      const title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
      
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content: message.content,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      const savedNote = await response.json();
      toast.success(`Note saved: "${savedNote.title}"`);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
          {messages.map((message) => (
            <Card key={message.id} className={`max-w-2xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold font-sketch capitalize">{message.role}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-sans">
                      {formatTime(message.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-muted"
                      onClick={() => saveMessageAsNote(message)}
                    >
                      <MoreHorizontal size={12} />
                    </Button>
                  </div>
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
            <textarea 
              className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] max-h-[200px]"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading && input.trim()) {
                    const form = e.currentTarget.form;
                    if (form) {
                      const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                      form.dispatchEvent(formEvent);
                    }
                  }
                }
              }}
              disabled={isLoading}
              rows={4}
              onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
