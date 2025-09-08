'use server';

import { signIn, signOut } from '../../infrastructure/auth/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function createUser(prevState: string | undefined, formData: FormData) {
  try {
    const validatedFields = signupSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return 'Invalid form data.';
    }

    const { name, email, password } = validatedFields.data;

    // TODO: Replace with actual user creation in database
    // For now, just simulate user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Mock user creation - in real app, save to database
    console.log('Creating user:', { name, email, hashedPassword });

    // After successful signup, sign in the user
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/' });
}
