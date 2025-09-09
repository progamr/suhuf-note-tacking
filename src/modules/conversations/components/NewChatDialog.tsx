'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../ui';
import { toast } from 'react-toastify';

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
      console.log('🔍 API Response:', data);
      
      // Show success toast if note was saved
      if (data.conversation.noteSaved) {
        console.log('📢 Showing toast notification for saved note');
        toast.success('Note saved automatically!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Wait a moment for toast to render before navigation
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
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
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Type your first message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                autoFocus
                rows={4}
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
