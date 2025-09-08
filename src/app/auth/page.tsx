import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card/Card';

export default function AuthenticatedHomePage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab || 'conversations';

  if (!['conversations', 'notes'].includes(tab)) {
    redirect('/?tab=conversations');
  }

  return (
    <div>
      {tab === 'conversations' ? <ConversationsTab /> : <NotesTab />}
    </div>
  );
}

function ConversationsTab() {
  const conversations = [
    { id: '1', title: 'How to setup Docker on Mac', lastMessage: 'First download docker from official site...', time: '2h' },
    { id: '2', title: 'Creating a basic Go API', lastMessage: 'Let\'s start by setting up the project structure...', time: '3d' },
  ];

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button asChild>
          <Link href="/conversations/new" className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>New Conversation</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {conversations.map(conversation => (
          <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
            <Card className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{conversation.title}</CardTitle>
                  <span className="text-sm text-muted-foreground font-sans">{conversation.time}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-sans truncate">{conversation.lastMessage}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
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
