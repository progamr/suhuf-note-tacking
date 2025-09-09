'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NoteData = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

interface NoteDetailsClientProps {
  noteId: string;
}

export function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Note not found');
          return;
        }
        throw new Error('Failed to fetch note');
      }

      const data = await response.json();
      setNote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading note...</div>
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

  if (!note) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Note not found</div>
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-sketch text-2xl">{note.title}</CardTitle>
          <div className="flex gap-4 text-sm text-muted-foreground font-sans">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span>Updated: {formatDate(note.updatedAt)}</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="font-sans whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>
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
