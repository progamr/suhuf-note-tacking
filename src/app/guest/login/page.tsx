import Link from 'next/link';
import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card/Card';
import { Input } from '@/ui/components/Input/Input';

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 font-sketch">
                Email
              </label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1 font-sketch">
                Password
              </label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
