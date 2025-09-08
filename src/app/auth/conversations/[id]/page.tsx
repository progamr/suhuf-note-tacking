import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent } from '@/ui/components/Card/Card';
import { Input } from '@/ui/components/Input/Input';

export default function ConversationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock conversation data
  const conversation = {
    id: params.id,
    title: 'How to setup Docker on Mac',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'How do I set up Docker on my Mac?',
      },
      {
        id: '2',
        role: 'assistant',
        content: `First, download Docker from the official site...`,
      },
      {
        id: '3',
        role: 'user',
        content: 'But I have this error xyz',
      },
      {
        id: '4',
        role: 'assistant',
        content: `Let me check this error...`,
      },
    ],
  };

  return (
    <div className="flex flex-col h-[calc(100vh-15rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/?tab=conversations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{conversation.title}</h1>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-muted border-2 border-foreground flex-shrink-0"></div>}
              <div
                className={`max-w-lg rounded-lg p-3 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans ${
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
                }`}>
                <p>{message.content}</p>
              </div>
              {message.role === 'user' && <div className="w-8 h-8 rounded-full bg-primary border-2 border-foreground flex-shrink-0"></div>}
            </div>
          ))}
        </CardContent>
        <div className="p-4 border-t-2 border-foreground">
          <div className="relative">
            <Input
              placeholder="Type your message..."
              className="pr-12"
            />
            <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
