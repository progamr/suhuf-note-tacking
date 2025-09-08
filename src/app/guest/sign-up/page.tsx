import Link from 'next/link';
import { Button } from '@/ui/components/Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/Card/Card';
import { Input } from '@/ui/components/Input/Input';

export default function SignUpPage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-1 font-sketch">
                Name
              </label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold mb-1 font-sketch">
                Confirm Password
              </label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-bold hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
