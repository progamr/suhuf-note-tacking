import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
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
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
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

          const user = mockUsers.find((u) => u.email === email);
          
          if (user && await bcrypt.compare(password, user.password)) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }

        return null;
      },
    }),
  ],
};
