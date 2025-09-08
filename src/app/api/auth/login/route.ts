import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '../../../../infrastructure/auth/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedFields = loginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      );
    }

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
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
