import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, LogoutButton } from '../../../../ui';
import { ConversationsClient } from './ConversationsClient';
import { NotesClient } from '../../../notes/components/NotesClient';

export async function AuthHome({ tab = 'conversations' }: { tab?: string }) {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/" className="text-3xl font-sketch font-bold">
            Suhuf
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="font-bold font-sketch hover:underline">Settings</Link>
            <div className="w-10 h-10 bg-muted rounded-full border-2 border-foreground"></div>
            <span className="font-bold font-sketch">User</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="container mx-auto py-4">
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes" asChild>
              <Link href="/?tab=notes">Notes</Link>
            </TabsTrigger>
            <TabsTrigger value="conversations" asChild>
              <Link href="/?tab=conversations">Chat</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <main className="flex-1 container mx-auto pb-4">
        {tab === 'conversations' ? <ConversationsClient /> : <NotesClient />}
      </main>
    </div>
  );
}
