'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../ui';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NoteData = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export function NotesClient() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading notes...</div>
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
    <>
      <div>
        <div className="flex justify-end mb-6">
          <Button asChild className="flex items-center gap-2">
            <Link href="/notes/new">
              <PlusCircle size={18} />
              <span>New Note</span>
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          {notes.length > 0 ? notes.map(note => {
            const timeAgo = new Date(note.createdAt).toLocaleDateString();
            return (
              <Card key={note.id} className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex-1">{note.title}</CardTitle>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-muted-foreground font-sans">{timeAgo}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <Link href={`/notes/${note.id}/edit`}>
                          <Edit size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/notes/${note.id}`}>
                    <p className="text-muted-foreground font-sans line-clamp-3 hover:text-foreground cursor-pointer">
                      {note.content}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            );
          }) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">No notes yet. Create your first note!</p>
            </div>
          )}
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
