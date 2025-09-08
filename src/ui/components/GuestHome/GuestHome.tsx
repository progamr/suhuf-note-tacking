import Link from 'next/link';
import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card/Card';

export function GuestHome() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b-2 border-foreground">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link href="/" className="text-3xl font-sketch font-bold">
            Suhuf
          </Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/login" className="font-sketch font-bold hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="font-sketch font-bold hover:underline">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Suhuf</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Save & Manage your valuable conversations with AI as notes.
          </p>
          <div className="flex justify-center gap-4 mb-16">
            <Button asChild size="lg">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Login</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Chat with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Have meaningful conversations with our AI assistant on any topic.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Take Valuable Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Effortlessly save important information from your conversations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Organize and access your notes whenever you need them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t-2 border-foreground py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Suhuf. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
