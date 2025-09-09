'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NoteEditorProps {
  noteId?: string;
  initialTitle?: string;
  initialContent?: string;
}

export function NoteEditor({ noteId, initialTitle = '', initialContent = '' }: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    setIsLoading(true);

    try {
      const url = noteId ? `/api/notes/${noteId}` : '/api/notes';
      const method = noteId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      const savedNote = await response.json();
      toast.success(`Note ${noteId ? 'updated' : 'created'} successfully!`);
      
      // Redirect to notes tab after a short delay
      setTimeout(() => {
        router.push('/?tab=notes');
      }, 1500);

    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-sketch">
            {noteId ? 'Edit Note' : 'Create New Note'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium font-sketch mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter note title..."
                className="w-full rounded-md border-2 border-foreground px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                maxLength={100}
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium font-sketch mb-2">
                Content
              </label>
              <textarea
                id="content"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            </div>
            
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/?tab=notes')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !title.trim() || !content.trim()}
              >
                {isLoading ? 'Saving...' : (noteId ? 'Update Note' : 'Save Note')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
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
