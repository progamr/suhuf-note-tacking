import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button, Tabs, TabsList, TabsTrigger, Card, CardContent, CardHeader, CardTitle, LogoutButton } from '../../../../ui';
import { ConversationsClient } from './ConversationsClient';

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
        {tab === 'conversations' ? <ConversationsClient /> : <NotesTab />}
      </main>
    </div>
  );
}



function NotesTab() {
  const notes = [
    { id: '1', title: 'System req for new project', content: 'Low-latency, high throughput...', time: '2d' },
    { id: '2', title: 'Daily habits (list)', content: 'Morning routine, exercise, reading...', time: '1w' },
    { id: '3', title: 'Do the deployment of...', content: 'Steps to deploy the application...', time: '3w' },
  ];

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button asChild>
          <Link href="/notes/new" className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>New Note</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {notes.map(note => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <Card className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{note.title}</CardTitle>
                  <span className="text-sm text-muted-foreground font-sans">{note.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-sans truncate">{note.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
