import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../ui/components/Button/Button';
import { auth } from '../../../modules/auth/config/auth.config';
import { redirect } from 'next/navigation';
import { ConversationClient } from './ConversationClient';
import { ConversationHeader } from './ConversationHeader';

export default async function ConversationDetailsPage({
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
        <div className="container mx-auto flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back
            </Link>
          </Button>
          <ConversationHeader conversationId={id} />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <ConversationClient conversationId={id} />
      </main>
    </div>
  );
}
