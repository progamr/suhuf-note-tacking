'use server';

import { AuthError } from 'next-auth';
import { EntityManager } from "@mikro-orm/core";
import bcrypt from 'bcryptjs';
import { signIn, signOut } from '../config/auth.config';
import { loginSchema, signupSchema } from '../../../shared/schemas/auth.schemas';
import { UsersService } from '../../users/services/UsersService'; import { User } from '../../../infrastructure/database/entities';

// Helper function for credential validation (used by NextAuth)
export async function validateUserCredentials(user: User) {
  // TODO: implement proper complete authjs/mikroORM integration
  // For now, we do the validation in the loginUser function
  // https://authjs.dev/getting-started/adapters/mikro-orm
  if (user) {
    console.log('user value DEBUG', user);
      return {
        id: String(user.id),
        name: user.name,
        email: user.email,
        user
      };
    }
    return null;
}

// Route authorization logic
export async function authorizeRoute(isLoggedIn: boolean, pathname: string, nextUrl: URL) {
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
export async function loginUser(email: string, password: string, em: EntityManager) {
  try {
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      throw new Error('Invalid email or password.');
    }

    const usersService = new UsersService(em);
    const user = await usersService.getUserByEmail(email);

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      console.log('user value DEBUG', user);
      // TODO: implement proper complete authjs/mikroORM integration and remove manual
      // checking in this function
      await signIn('credentials', {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        user,
        redirect: false,
      });

      return { success: true, userT: user };
    } else {
      throw new Error('Invalid credentials.');
    }
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

export async function registerUser(name: string, email: string, password: string, em: EntityManager) {
  try {
    const validatedFields = signupSchema.safeParse({ name, email, password });

    if (!validatedFields.success) {
      throw new Error('Invalid form data.');
    }

    const { name: validName, email: validEmail, password: validPassword } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(validPassword, 10);

    // Mock user creation - avoiding database operations in auth context
    console.log('Creating user:', { name: validName, email: validEmail, hashedPassword });
    const usersService = new UsersService(em);
    const user = await usersService.create(validName, validEmail, hashedPassword);
    // After successful signup, sign in the user
    await signIn('credentials', {
      email: validEmail,
      password: validPassword,
      redirect: false,
    });

    return { success: true, user };
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