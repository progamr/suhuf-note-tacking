'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { Button } from '../Button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../Card/Card';
import { Input } from '../Input/Input';
import { createUser } from '../../../modules/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Sign Up'}
    </Button>
  );
}

export function SignupForm() {
  const [errorMessage, dispatch] = useFormState(createUser, undefined);

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-1 font-sketch">
                Name
              </label>
              <Input 
                id="name" 
                name="name"
                type="text" 
                placeholder="Your name"
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 font-sketch">
                Email
              </label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1 font-sketch">
                Password
              </label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}
            <SubmitButton />
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
