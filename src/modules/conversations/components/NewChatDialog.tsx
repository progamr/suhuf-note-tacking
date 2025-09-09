'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../../ui';

interface NewChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewChatDialog({ isOpen, onClose }: NewChatDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/conversations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstMessage: message.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const data = await response.json();
      
      // Navigate to the new conversation
      router.push(`/conversations/${data.conversation.id}`);
      
    } catch (error) {
      console.error('Error creating conversation:', error);
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Start New Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Type your first message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? 'Starting...' : 'Start Chat'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
