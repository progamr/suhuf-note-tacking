import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../ui/components/Button/Button';
import { auth } from '../../../modules/auth/config/auth.config';
import { redirect } from 'next/navigation';
import { NoteEditor } from '../../../modules/notes/components/NoteEditor';

export default async function NewNotePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-foreground p-4">
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/?tab=notes" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Notes
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-sketch">New Note</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <NoteEditor />
      </main>
    </div>
  );
}
