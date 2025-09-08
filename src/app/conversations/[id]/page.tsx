import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../../../ui/components/Button/Button';
import { Card, CardContent } from '../../../ui/components/Card/Card';
import { Input } from '../../../ui/components/Input/Input';
import { auth } from '../../../modules/auth/config/auth.config';
import { redirect } from 'next/navigation';

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

  const conversation = {
    id: id,
    title: 'How to setup Docker on Mac',
    messages: [
      { id: '1', role: 'user', content: 'How do I setup Docker on Mac?', time: '10:30 AM' },
      { id: '2', role: 'assistant', content: 'First, download Docker Desktop from the official Docker website...', time: '10:31 AM' },
      { id: '3', role: 'user', content: 'What are the system requirements?', time: '10:35 AM' },
      { id: '4', role: 'assistant', content: 'Docker Desktop for Mac requires macOS 10.15 or newer...', time: '10:36 AM' },
    ]
  };

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
          <h1 className="text-xl font-bold font-sketch">{conversation.title}</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 flex flex-col">
        <div className="flex-1 space-y-4 mb-4">
          {conversation.messages.map((message) => (
            <Card key={message.id} className={`max-w-2xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold font-sketch capitalize">{message.role}</span>
                  <span className="text-sm text-muted-foreground font-sans">{message.time}</span>
                </div>
                <p className="font-sans">{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="border-t-2 border-foreground pt-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Type your message..." 
              className="flex-1"
            />
            <Button>
              <Send size={18} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
