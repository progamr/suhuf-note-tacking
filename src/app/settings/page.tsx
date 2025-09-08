import { auth } from '../../modules/auth/config/auth.config';
import { redirect } from 'next/navigation';
import { Button } from '../../ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/components/Card/Card';
import { Input } from '../../ui/components/Input/Input';
import { LogoutButton } from '../../ui/components/LogoutButton/LogoutButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SettingsPage() {
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
          <h1 className="text-xl font-bold font-sketch">Settings</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-1 font-sketch">
                  Name
                </label>
                <Input 
                  id="name" 
                  type="text" 
                  defaultValue={session.user.name || ''}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-1 font-sketch">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue={session.user.email || ''}
                  placeholder="your@email.com"
                  disabled
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold font-sketch">Sign Out</h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Sign out of your account
                  </p>
                </div>
                <LogoutButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
