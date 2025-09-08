'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '../config/auth.config';
import { credentialsSchema, loginSchema, signupSchema } from '../../../shared/schemas/auth.schemas';

// Helper function for credential validation (used by NextAuth)
export async function validateUserCredentials(email: string, password: string) {
  const parsedCredentials = credentialsSchema.safeParse({ email, password });

  if (parsedCredentials.success) {
    const { email: validEmail, password: validPassword } = parsedCredentials.data;
    
    // TODO: Replace with actual user lookup from database
    // For now, using mock data
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password456', 10),
      },
    ];

    const user = mockUsers.find((u) => u.email === validEmail);
    
    if (user && await bcrypt.compare(validPassword, user.password)) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
  }

  return null;
}

// Route authorization logic
export function authorizeRoute(isLoggedIn: boolean, pathname: string, nextUrl: URL) {
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/sign-up'];
    const isPublicRoute = publicRoutes.includes(pathname);
    
    // Protected routes that require authentication
    const protectedRoutes = ['/conversations', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    // Root route - accessible to both authenticated and unauthenticated users
    if (pathname === '/') {
      return true;
    }
    
    // Redirect authenticated users away from auth pages
    if (isLoggedIn && isPublicRoute) {
      return Response.redirect(new URL('/', nextUrl));
    }
    
    // Protect routes that require authentication
    if (isProtectedRoute && !isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
    
    return true;
  }

// API handlers for authentication
export async function loginUser(email: string, password: string) {
  try {
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      throw new Error('Invalid email or password.');
    }

    await signIn('credentials', {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid credentials.');
        default:
          throw new Error('Something went wrong.');
      }
    }
    throw error;
  }
}

export async function registerUser(name: string, email: string, password: string) {
  try {
    const validatedFields = signupSchema.safeParse({ name, email, password });

    if (!validatedFields.success) {
      throw new Error('Invalid form data.');
    }

    const { name: validName, email: validEmail, password: validPassword } = validatedFields.data;

    // TODO: Replace with actual user creation in database
    // For now, just simulate user creation
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    
    // Mock user creation - in real app, save to database
    console.log('Creating user:', { name: validName, email: validEmail, hashedPassword });

    // After successful signup, sign in the user
    await signIn('credentials', {
      email: validEmail,
      password: validPassword,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          throw new Error('Invalid credentials.');
        default:
          throw new Error('Something went wrong.');
      }
    }
    throw error;
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: '/' });
}