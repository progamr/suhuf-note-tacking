import { z } from 'zod';

// Base credential schema for NextAuth
export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Login validation schema with custom error messages
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Signup validation schema with custom error messages
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;
