import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '../../../../infrastructure/auth/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedFields = signupSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid form data.' },
        { status: 400 }
      );
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
      redirect: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return NextResponse.json(
            { error: 'Invalid credentials.' },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { error: 'Something went wrong.' },
            { status: 500 }
          );
      }
    }
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
