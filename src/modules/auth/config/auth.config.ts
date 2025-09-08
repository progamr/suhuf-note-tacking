import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateUserCredentials, authorizeRoute } from '../services/AuthService';

// Auth configuration
const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      return authorizeRoute(isLoggedIn, pathname, nextUrl);
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log('credentials DEBUGGING', credentials);
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        return await validateUserCredentials(
          credentials as any
        );
      },
    }),
  ],
};

// NextAuth instance
const nextAuth = NextAuth(authConfig);
export const { handlers, auth, signIn, signOut } = nextAuth;
