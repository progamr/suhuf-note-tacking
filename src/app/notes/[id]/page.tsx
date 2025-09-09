import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '../../../ui/components/Button/Button';
import { auth } from '../../../modules/auth/config/auth.config';
import { redirect } from 'next/navigation';
import { NoteDetailsClient } from '../../../modules/notes/components/NoteDetailsClient';

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/?tab=notes" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Notes
              </Link>
            </Button>
            <h1 className="text-xl font-bold font-sketch">Note Details</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/notes/${id}/edit`} className="flex items-center gap-2">
              <Edit size={16} />
              Edit
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <NoteDetailsClient noteId={id} />
      </main>
    </div>
  );
}
